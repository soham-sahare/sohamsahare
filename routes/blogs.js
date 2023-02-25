const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./blogs/blogs');
})

router.get('/single', (req, res) => {
    res.render('./blogs/blog');
})

module.exports = router; 