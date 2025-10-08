const path = require('path');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();
const { sendContactEmail } = require('./config/email');

// Load project and experiences data
const projectData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // keep disabled unless CSP is curated for EJS assets
  crossOriginEmbedderPolicy: false
}));

// Session configuration
// If behind a proxy (Heroku, Vercel, Nginx), enable trust proxy for secure cookies to work when desired
app.set('trust proxy', 1);

const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CSRF token setup (simple token for login/logout/forms)
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Origin check middleware for admin APIs
const requireSameOrigin = (req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const host = req.get('host');
  const allowed = !origin || origin.includes(host) || (referer && referer.includes(host));
  if (!allowed) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Create deleted uploads directory (recycle bin)
const deletedUploadsDir = path.join(uploadsDir, 'deleted');
if (!fs.existsSync(deletedUploadsDir)) {
  fs.mkdirSync(deletedUploadsDir, { recursive: true });
}

app.get('/', (req, res) => {
  res.render('index', { 
    projectCount: projectData.projects.length,
    projects: projectData.projects,
    socials: projectData.socials || [],
    skills: projectData.skills || [],
    contact: projectData.contact || {}
  });
});

app.get('/about-me', (req, res) => {
  res.render('about', { 
    projectCount: projectData.projects.length,
    projects: projectData.projects,
    experiences: projectData.experiences || [],
    education: projectData.education || [],
    testimonials: projectData.testimonials || [],
    socials: projectData.socials || [],
    contact: projectData.contact || {}
  });
});

app.get('/projects', (req, res) => {
  res.render('projects', { 
    projects: projectData.projects,
    projectCount: projectData.projects.length,
    socials: projectData.socials || [],
    contact: projectData.contact || {}
  });
});

app.get('/projects/:projectId', (req, res) => {
  const { projectId } = req.params;
  const project = projectData.projects.find(p => p.id === projectId);
  
  if (!project) {
    return res.status(404).render('404');
  }
  
  res.render('project-details', { 
    project,
    projectCount: projectData.projects.length,
    projects: projectData.projects,
    socials: projectData.socials || [],
    contact: projectData.contact || {}
  });
});

app.get('/experience/:id', (req, res) => {
  const { id } = req.params;
  const experiences = projectData.experiences || [];
  const experience = experiences.find(exp => exp.id === id);

  if (!experience) {
    return res.status(404).render('404');
  }

  res.render('experience-details', {
    experience,
    projectCount: projectData.projects.length,
    projects: projectData.projects,
    socials: projectData.socials || [],
    contact: projectData.contact || {}
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    projectCount: projectData.projects.length,
    projects: projectData.projects,
    socials: projectData.socials || [],
    contact: projectData.contact || {}
  });
});

app.post('/contact', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ No form data received');
      return res.status(400).json({ success: false, message: 'No form data received' });
    }

    const { Name, 'E-mail': email, Message } = req.body;
    const formData = {
      Name: Name || 'Not provided',
      email: email || 'Not provided',
      Message: Message || 'No message provided'
    };

    // Respond immediately to avoid blocking the UI
    res.status(202).json({
      success: true,
      message: 'Form received. Sending email in background.',
      timestamp: new Date().toISOString()
    });

    // Send email asynchronously (fire-and-forget)
    const recipientEmail = email || formData.email;
    setImmediate(() => {
      sendContactEmail(formData, recipientEmail)
        .then((emailResult) => {
          if (emailResult.success) {
            console.log('✅ Email sent successfully (background).');
          } else {
            console.error('❌ Email delivery failed (background):', emailResult.error);
          }
        })
        .catch((err) => {
          console.error('❌ Error sending email (background):', err);
        });
    });
  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    // If we reach here before responding, return error; otherwise just log
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

app.get('/blocked', (req, res) => {
  res.render('blocked');
});

// Authentication routes
app.get('/admin/login', (req, res) => {
  // If already authenticated, redirect to admin panel
  if (req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  res.render('admin-login');
});

app.post('/admin/login', loginLimiter, (req, res) => {
  // If already authenticated, redirect to admin panel
  if (req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  // CSRF check
  const { username, password, csrfToken } = req.body;
  if (!csrfToken || csrfToken !== req.session.csrfToken) {
    return res.status(403).render('admin-login', { error: 'Invalid session. Refresh and try again.' });
  }
  
  // Simple hardcoded credentials - change these!
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // optional bcrypt hash

  const userOk = username === ADMIN_USERNAME;
  const passwordOk = ADMIN_PASSWORD_HASH
    ? bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
    : password === ADMIN_PASSWORD;

  if (userOk && passwordOk) {
    // Prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).render('admin-login', { error: 'Login error. Try again.' });
      }
      req.session.isAuthenticated = true;
      // rotate CSRF after login
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
      res.redirect('/admin');
    });
  } else {
    res.render('admin-login', { error: 'Invalid credentials' });
  }
});

app.post('/admin/logout', (req, res) => {
  // CSRF check
  const token = req.body && req.body.csrfToken;
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).redirect('/admin');
  }
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect('/admin/login');
  });
});

// Protected admin route
app.get('/admin', requireAuth, (req, res) => {
  res.render('admin', { 
    projectData: projectData,
    projectCount: projectData.projects.length,
    projects: projectData.projects || [],
    experiences: projectData.experiences || [],
    education: projectData.education || [],
    testimonials: projectData.testimonials || [],
    socials: projectData.socials || [],
    skills: projectData.skills || [],
    contact: projectData.contact || {}
  });
});

// Admin API routes for CRUD operations (all protected)
app.post('/admin/projects', requireAuth, requireSameOrigin, upload.array('images', 10), (req, res) => {
  try {
    const newProject = req.body;
    newProject.id = newProject.id || Date.now().toString();
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      newProject.images = req.files.map(file => `/uploads/${file.filename}`);
    } else {
      newProject.images = [];
    }
    
    projectData.projects.push(newProject);
    
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/admin/projects/:id', requireAuth, requireSameOrigin, upload.array('images', 10), (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = projectData.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const updatedProject = { ...projectData.projects[projectIndex], ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updatedProject.images = [...(updatedProject.images || []), ...newImages];
    }
    
    projectData.projects[projectIndex] = updatedProject;
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/admin/projects/:id', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { id } = req.params;
    projectData.projects = projectData.projects.filter(p => p.id !== id);
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/admin/experiences', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const newExperience = req.body;
    newExperience.id = newExperience.id || Date.now().toString();
    projectData.experiences.push(newExperience);
    
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Experience added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/admin/experiences/:id', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { id } = req.params;
    const experienceIndex = projectData.experiences.findIndex(e => e.id === id);
    if (experienceIndex === -1) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    
    projectData.experiences[experienceIndex] = { ...projectData.experiences[experienceIndex], ...req.body };
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Experience updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/admin/experiences/:id', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { id } = req.params;
    projectData.experiences = projectData.experiences.filter(e => e.id !== id);
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/admin/testimonials', requireAuth, requireSameOrigin, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), (req, res) => {
  try {
    const newTestimonial = req.body;
    newTestimonial.id = newTestimonial.id || Date.now().toString();
    
    // Handle uploaded files
    if (req.files) {
      if (req.files.avatar && req.files.avatar[0]) {
        newTestimonial.avatar = `/uploads/${req.files.avatar[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        newTestimonial.image = `/uploads/${req.files.image[0].filename}`;
      }
    }
    
    projectData.testimonials.push(newTestimonial);
    
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Testimonial added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/admin/testimonials/:id', requireAuth, requireSameOrigin, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), (req, res) => {
  try {
    const { id } = req.params;
    const testimonialIndex = projectData.testimonials.findIndex(t => t.id === id);
    if (testimonialIndex === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    
    const updatedTestimonial = { ...projectData.testimonials[testimonialIndex], ...req.body };
    
    // Handle uploaded files
    if (req.files) {
      if (req.files.avatar && req.files.avatar[0]) {
        updatedTestimonial.avatar = `/uploads/${req.files.avatar[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        updatedTestimonial.image = `/uploads/${req.files.image[0].filename}`;
      }
    }
    
    projectData.testimonials[testimonialIndex] = updatedTestimonial;
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Testimonial updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/admin/testimonials/:id', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { id } = req.params;
    projectData.testimonials = projectData.testimonials.filter(t => t.id !== id);
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/admin/skills', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { skills } = req.body;
    projectData.skills = skills;
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Skills updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Image management routes
app.delete('/admin/projects/:id/images/:imageIndex', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const projectIndex = projectData.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const project = projectData.projects[projectIndex];
    if (!project.images || imageIndex >= project.images.length) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Move the file to the deleted folder instead of permanent delete (soft delete)
    const imageRelPath = project.images[imageIndex];
    const imagePath = path.join(__dirname, 'public', imageRelPath);
    if (fs.existsSync(imagePath)) {
      const fileName = path.basename(imagePath);
      const targetPath = path.join(deletedUploadsDir, fileName);
      fs.renameSync(imagePath, targetPath);
      // Track deleted images for possible recovery
      project.deletedImages = project.deletedImages || [];
      project.deletedImages.push({
        fileName,
        originalPath: imageRelPath,
        deletedAt: new Date().toISOString()
      });
    }
    
    // Remove from project images array
    project.images.splice(imageIndex, 1);
    
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Image moved to deleted', movedTo: `/uploads/deleted/` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Restore an image from the deleted folder back to a project
app.post('/admin/projects/:id/images/restore', requireAuth, requireSameOrigin, (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;
    const projectIndex = projectData.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const project = projectData.projects[projectIndex];
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'fileName is required' });
    }

    const sourcePath = path.join(deletedUploadsDir, fileName);
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ success: false, message: 'Deleted image not found' });
    }

    // Move back to uploads root and push to project images
    const restoredPath = `/uploads/${fileName}`;
    const destPath = path.join(uploadsDir, fileName);
    fs.renameSync(sourcePath, destPath);

    project.images = project.images || [];
    project.images.push(restoredPath);
    // Remove from deletedImages list if tracked
    if (project.deletedImages && project.deletedImages.length) {
      project.deletedImages = project.deletedImages.filter(d => d.fileName !== fileName);
    }

    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(projectData, null, 2));
    res.json({ success: true, message: 'Image restored successfully', path: restoredPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});