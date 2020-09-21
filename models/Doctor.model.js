const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var doctorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: "Full name can't be empty",
    },
    email: {
        type: String,
        required: "Email can't be empty",
        unique: true,
    },
    password: {
        type: String,
        required: "Password can't be empty",
        minlength: [4, 'Password must be atleast 4 character long'],
    },
    saltSecret: String,

    doctorDetails: {
        detailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocDetail' }
    },

    imgUrl: {
        type: String,
        default: ""
    },

    sessionlList: [
        {
            session: { type: String, default: '' },

        }
    ],

    limitpatients: {
        type: Number,
        default: 0
    },

    appointments: [
        {
            appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
            problem: { type: String, default: '' },
            appointmentDate: { type: String, default: '' },
            sessionTimings: { type: String, default: '' },
            patientname: { type: String, default: '' }

        },
    ],

    Feedbacks: [
        {
            name: { type: String, default: '' },
            comment: { type: String, default: '' },
            created: { type: Date, default: Date.now() },
        },
    ],

    patientsList: [
        { patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } },
    ],

    notifications: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            problem: { type: String },
            viewProfile: { type: Boolean, default: false },
            created: { type: Date, default: Date.now() },
            read: { type: Boolean, default: false },
            date: { type: String, default: '' },
        },
    ],

    // picVersion: { type: String, default: '1592916353' },
    // picId: { type: String, default: 'v31avvznqcfkzbor3aod.jpg' },

    // images: [
    //     {
    //         imgId: { type: String, default: '' },
    //         imgVersion: { type: String, default: '' },
    //     },
    // ],

});

// Custom validation for email
doctorSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
doctorSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

// Methods
doctorSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

doctorSchema.methods.generateJwt = function () {
    return jwt.sign(
        { _id: this._id, fullName: this.fullName },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP,
        }
    );
};

doctorSchema.set('autoIndex', false);

module.exports = mongoose.model('doctor', doctorSchema);
