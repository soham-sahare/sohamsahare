const mongoose = require('mongoose');

const projects = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    image: {
        required: true,
        type: String
    },
    
})

module.exports = mongoose.model('projects', categories)