const express = require('express');
const router = express.Router();
const data = require("../data.json");

router.get('/', (req, res) => {
    res.render('./projects/projects');
})

router.get('/ia_management_system', (req, res) => {
    res.render('./projects/project', new_data = data[0]);
})

router.get('/v_repository', (req, res) => {
    res.render('./projects/project', new_data = data[1]);
})

router.get('/up_learn', (req, res) => {
    res.render('./projects/project', new_data = data[2]);
})

router.get('/voom_meet', (req, res) => {
    res.render('./projects/project', new_data = data[3]);
})

router.get('/kooke_s_cafe', (req, res) => {
    res.render('./projects/project', new_data = data[4]);
})

router.get('/c_url', (req, res) => {
    res.render('./projects/project', new_data = data[5]);
})

router.get('/c_url', (req, res) => {
    res.render('./projects/project', new_data = data[5]);
})

module.exports = router; 