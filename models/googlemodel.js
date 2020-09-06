const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const streams = require('../socket/streams');

var googleuserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "Email can't be empty",
        unique: true,
    },
    username: {
        type: String,
        required: "Full name can't be empty",
    },

    googleId: {
        type: String
    },

    imgurl: {
        type: String,
    },

});

googleuserSchema.methods.generateJwt = function () {
    return jwt.sign(
        { googleId: this.googleId, username: this.username },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP,
        }
    );
};

module.exports = mongoose.model('GoogleUser', googleuserSchema);