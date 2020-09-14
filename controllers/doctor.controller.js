const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { attempt } = require('lodash');
const jwt = require('jsonwebtoken')

//Models
const User = require("../models/user.model")
const postfeed = require("../models/postfeedmodel");
const googleUser = require('../models/googlemodel');
const doctor = require('../models/Doctor.model');



module.exports.register = (req, res, next) => {
    var user = new doctor();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err) res.status(200).send({ message: "Doctor created", doc });
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else return next(err);
        }
    });
};

module.exports.authenticate = (req, res, next) => {
    //custom Authenticaton withou passportHelper
};

module.exports.userProfile = (req, res, next) => {
    doctor.findOne({ _id: req._id }, (err, user) => {
        if (!user)
            return res
                .status(404)
                .json({ status: false, message: 'doctor record not found.' });
        else
            return res
                .status(200)
                .json({ status: true, user: _.pick(user, ['fullName', 'email']) });
    });
};

module.exports.getDoctors = async (req, res) => {
    try {
        var doctors = await doctor
            .find({})
            .sort({ created: -1 });
        return res.status(200).json({ message: 'all doctors', doctors });
    } catch (err) {
        return res.status(400).json({ message: 'error occured in getting doctors' });
    }
};

module.exports.getSingleDoctors = async (req, res) => {
    await doctor.findOne({
        _id: req.params.id,
    })
        .then((record) => {
            res.status(200).json({ message: 'Single Doctor Found', record });
        })
        .catch((err) => {
            res.status(400).json({ message: 'went wrong with finding !' });
        });
}

