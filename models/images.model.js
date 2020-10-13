const mongoose = require('mongoose');


var ImgSchema = new mongoose.Schema({
    filename: {
        type: String,
    },
    originalName: {
        type: String,
    },

    desc: {
        type: String
    },
    created: { type: Date, default: Date.now }

});



module.exports = mongoose.model('Image', ImgSchema);