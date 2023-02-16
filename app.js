const express = require('express');
const app = express();
const formidable = require('express-formidable');

const expressEjsLayout = require('express-ejs-layouts')
const mongoose = require('mongoose');

var nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;

const dotenv = require("dotenv")
dotenv.config()

app.use(express.static('public'));
app.use(formidable());

app.set('views');

app.set('view engine', 'ejs');
app.use(expressEjsLayout);

app.use('/', require('./routes'));
app.use('/projects', require('./routes/projects'));
app.use('/blogs', require('./routes/blogs'));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () =>
    console.info(`App running on : http://localhost:${PORT}/`)
)