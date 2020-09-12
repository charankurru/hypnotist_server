const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { attempt } = require('lodash');
const { getfeed } = require('./user.controller');

const User = mongoose.model('User');
const postfeed = mongoose.model('Postfeed');
const appointment = require('../models/take-appoint.model');
const doctor = require('../models/Doctor.model');

module.exports = {

    async postappointment(req, res) {
        console.log(req.body);
        var body = {
            userId: req._id,
            username: req.fullName,
            doctorname: req.body.doctorname,
            problem: req.body.problem,
            appointmentDate: req.body.appointmentDate,
            doctorId: req.body.doctorId,
            created: new Date(),
            sessionTimings: req.body.sessionTimings
        };
        appointment
            .create(body)
            .then(async (appoint) => {
                await User.update(
                    { _id: req._id },
                    {
                        $push: {
                            appointments: {
                                appointmentId: appoint._id,
                                doctorname: req.body.doctorname,
                                problem: req.body.problem,
                                appointmentDate: req.body.appointmentDate,
                                sessionTimings: req.body.sessionTimings
                            },
                        },
                    }
                );
                await doctor.update(
                    { fullName: req.body.doctorname },
                    {
                        $push: {
                            appointments: {
                                appointmentId: appoint._id,
                                problem: req.body.problem,
                                patientname: req.fullName,
                                appointmentDate: req.body.appointmentDate,
                                sessionTimings: req.body.sessionTimings,
                            },
                        },
                    }
                );
                res.status(200).json({ message: 'Appointment Requested', appoint });
            })
            .catch((err) => {
                res.status(400).json({ message: 'error Occured' });
            });
    },


    async getappointements(req, res, next) {
        await User.findOne({
            _id: req._id,
        })
            .populate('appointments.appointmentId')
            .then((record) => {
                res.status(200).json({ message: 'appoint fond', record });
            })
            .catch((err) => {
                res.status(400).json({ message: 'went wrong with finding !' });
            });
    },

    async findPosibility(req, res, next) {
        const reqdata = {
            id: req.body.id,
            date: req.body.appointmentDate,
            limit: req.body.limitpatients,
            sessionsArr: req.body.sessArr,
        }
        // console.log(reqdata);
        // console.log(reqdata.sessionsArr[0].session)
        const tresh = reqdata.sessionsArr.length;
        appointment.find({ doctorId: reqdata.id },
            // {
            //     $and: [
            //         { "appointments.appointmentDate": "2020-09-11T11:21:14.300+05:30" },
            //         { "appointments.sessionTimings": "9am-11am" }
            //     ]
            // }
            { "appointments.appointmentDate": "2020-09-11T11:21:14.300+05:30" }

            , async (err, result) => {
                const obj = JSON.stringify(result)
                const jsObj = JSON.parse(obj);

                if (jsObj.length == 0) {
                    const freetimmings = [];
                    for (i = 0; i < tresh; i++) {
                        freetimmings.push(reqdata.sessionsArr[i].session);
                    }
                    const data = reqdata.sessionsArr;
                    return res.status(200).json({ message: "All sessions are available", freetimmings })
                }
                else if (jsObj.length == (reqdata.limit * tresh)) {
                    const data = []
                    return res.status(200).json({ message: "All sessions are Filled", data })
                }
                else if (jsObj.length > 0) {
                    // big function
                    const freetimmings = [];
                    for (i = 0; i < tresh; i++) {
                        await appointment.find({ doctorId: reqdata.id }, {
                            $and: [
                                { "appointments.appointmentDate": reqdata.appointmentDate },
                                { "appointments.sessionTimings": reqdata.sessionsArr[i].session }
                            ]
                        }, async (err, record) => {

                            const iterobj = JSON.stringify(record)
                            const iterjsObj = JSON.parse(iterobj);

                            console.log(iterjsObj);

                            if (iterjsObj.length >= 0 && iterjsObj.length < reqdata.limit) {
                                freetimmings.push(reqdata.sessionsArr[i].session)
                                console.log(freetimmings);
                            }
                            else {
                                return res.status(200).json({ message: "got error from iteration" });
                            }
                        });
                    }
                    return res.status(200).json({ message: "found the possibiity", freetimmings });
                }
                else {
                    return res.status(400).json({ message: "some error in if outer condition" })
                }

                if (err) {
                    return res.status(400).json({ message: "some error frmo database from finding the date" })
                }

            });
    }
};
