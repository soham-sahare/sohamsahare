const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./projects/projects');
})

router.get('/single', (req, res) => {
    res.render('./projects/single-project');
})

module.exports = router; 