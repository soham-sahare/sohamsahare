const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./projects/projects');
})

router.get('/ia_management_system', (req, res) => {
    res.render('./projects/ia_management_system');
})

router.get('/repository_system', (req, res) => {
    res.render('./projects/repository_system');
})

router.get('/up_learn', (req, res) => {
    res.render('./projects/up_learn');
})

module.exports = router; 