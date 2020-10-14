const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { attempt } = require('lodash');
const jwt = require('jsonwebtoken')


const User = require("../models/user.model")
const postfeed = require("../models/postfeedmodel");
const googleUser = require('../models/googlemodel');

module.exports.register = (req, res, next) => {
  var user = new User();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save((err, doc) => {
    if (!err) res.status(200).send({ message: "user created successfully", doc });
    else {
      if (err.code == 11000)
        res.status(422).send(['Duplicate email adrress found.']);
      else return next(err);
    }
  });
};

module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // error from passport middleware

    if (err) return res.status(400).json(err);
    // registered user

    else if (user) return res.status(200).json({ token: user.generateJwt() });
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};

module.exports.google = (req, res, next) => {

  console.log(req.body)
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      var newgoogleUser = {
        fullName: req.body.name,
        email: req.body.email,
        UserImg: req.body.imgurl,
        password: "kjsbdbfskjhvsbvskhbvsavbkbb@#@#"
      }
      console.log(newgoogleUser)
      User.create(newgoogleUser)
        .then(result => {
          var payload = {
            _id: result._id,
            fullName: result.fullName,
            email: result.email,
            UserImg: result.UserImg
          }
          var newToken = jwt.sign(payload, process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXP,
            })
          res.status(200).json({ message: "token provided after userCreated", newToken })
        })
        .catch(err => console.log("something problem in creating user"))
    }
    else {
      console.log(user);
      var payload = {
        _id: user._id,
        fullName: req.body.name,
        email: user.email,
        UserImg: user.UserImg
      }
      var newToken = jwt.sign(payload, process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXP,
        });
      return res.status(200).json({ message: "token provided after user verified", newToken });
    }
  });
};

module.exports.userProfile = (req, res, next) => {
  User.findOne({ _id: req._id }, (err, user) => {
    if (!user)
      return res
        .status(404)
        .json({ status: false, message: 'User record not found.' });
    else
      return res
        .status(200)
        .json({ status: true, user: _.pick(user, ['fullName', 'email']) });
  });
};


