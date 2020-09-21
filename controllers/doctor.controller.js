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
const appoint = require('../models/take-appoint.model');



module.exports.register = (req, res, next) => {
    var docto = new doctor();
    docto.fullName = req.body.fullName;
    docto.email = req.body.email;
    docto.password = req.body.password;
    docto.save((err, doc) => {
        if (!err) res.status(200).send({ message: "Doctor created successfully", doc });
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else return next(err);
        }
    });
};


module.exports.authenticate = (req, res, next) => {

    doctor.findOne({ email: req.body.email }, (err, user) => {

        if (err) {
            return res.status(400).json({ message: "Something went wrong" });
        }

        else if (!user) {
            return res.status(200).json({ message: "User Not found Need to signup" });
        }

        else if (!user.verifyPassword(req.body.password)) {
            return res.status(200).json({ message: "Wrong Password" });
        }

        else {
            let userObj = JSON.stringify(user);
            let docObj = JSON.parse(userObj)

            var payload = {
                _id: docObj._id,
                fullName: docObj.fullName
            }
            var newToken = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXP,
                });
            return res.status(200).json({ message: "token provided after user verified", newToken });
        }
    });
}

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
};


module.exports.GetDocappointements = async (req, res, next) => {
    console.log(req._id)
    await appoint.find({
        doctorId: req._id,
    })
        .then((record) => {
            res.status(200).json({ message: 'Doctor appoints fond', record });
        })
        .catch((err) => {
            res.status(400).json({ message: 'went wrong with finding !' });
        });
};

