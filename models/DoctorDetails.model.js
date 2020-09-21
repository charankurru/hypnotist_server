const mongoose = require('mongoose');

var doctordetailsSchema = new mongoose.Schema({


    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },

    qualification: {
        type: String,
        default: '',
        required: "qualification can't be empty",
    },

    Speciality: {
        type: String,
        default: '',
        required: "Speciality can't be empty",
    },

    imgUrl: {
        type: String,
        default: ""
    },


    limitpatients: {
        type: Number,
        default: 0
    },

    organization: {
        type: String,
        default: ''
    }


    // picVersion: { type: String, default: '1592916353' },
    // picId: { type: String, default: 'v31avvznqcfkzbor3aod.jpg' },

    // images: [
    //     {
    //         imgId: { type: String, default: '' },
    //         imgVersion: { type: String, default: '' },
    //     },
    // ],

});

module.exports = mongoose.model('DocDetail', doctordetailsSchema);