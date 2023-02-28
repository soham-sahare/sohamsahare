const express = require('express');
const router = express.Router();
const data = require("../data.json");

const { Analytics } = require('@segment/analytics-node')

const analytics = new Analytics({ writeKey: process.env.KEY })

router.get('/', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: 'Project Page Visited'
    });

    res.render('./projects/projects');
})

router.get('/ia_management_system', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[0]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[0]);
})

router.get('/v_repository', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[1]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[1]);
})

router.get('/up_learn', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[2]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[2]);
})

router.get('/voom_meet', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[3]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[3]);
})

router.get('/kooke_s_cafe', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[4]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[4]);
})

router.get('/c_url', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[5]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[5]);
})

router.get('/sorting_visualiser', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: data[6]['name'] + ' - Project Page Visited'
    });

    res.render('./projects/project', new_data = data[6]);
})

module.exports = router; 