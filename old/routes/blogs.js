const express = require('express');
const router = express.Router();

const { Analytics } = require('@segment/analytics-node')

const analytics = new Analytics({ writeKey: process.env.KEY })

router.get('/', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: 'Blogs Page Visited'
    });

    res.render('./blogs/blogs');
})

router.get('/single', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: 'single Blog Page Visited'
    });

    res.render('./blogs/blog');
})

module.exports = router; 