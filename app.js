const express = require('express');
const app = express();
const formidable = require('express-formidable');
const expressEjsLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv")
const path = require('path');
const { urlencoded } = require('express');

// const { posthog } = require('posthog-node');

// posthog.init('phc_K7WFaxQu41MhcXIqG0l746cEVMm5LKojtNzOkyNR4yv', { api_host: 'https://app.posthog.com' })

dotenv.config()

app.use(formidable());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes'));
app.use('/projects', require('./routes/projects'));
app.use('/blogs', require('./routes/blogs'));

app.listen(PORT, () =>
    posthog.capture('my event', { property: 'value' }),
    console.info(`App running on : http://localhost:${PORT}/`)
)