const User = require("../models/user.model")
const postfeed = require("../models/postfeedmodel");
const googleUser = require('../models/googlemodel');
const doctor = require('../models/Doctor.model');
const appoint = require('../models/take-appoint.model');
const docDet = require('../models/DoctorDetails.model');


module.exports = {
    async PostDocDetails(req, res) {
        console.log(req.body.sessionarray)
        var body = {
            doctorId: req._id,
            qualification: req.body.qualification,
            Speciality: req.body.specialization,
            limitpatients: req.body.limitpatient,
            organization: req.body.organization,
        }
        let arr = req.body.sessionarray;
        let arrlen = arr.length;
        console.log(arrlen);
        docDet.find({ doctorId: req._id })
            .then(result => {
                if (result.length > 0) {
                    docDet.update({ doctorId: req._id },
                        {
                            $set: {
                                qualification: req.body.qualification,
                                Speciality: req.body.specialization,
                                limitpatients: req.body.limitpatient,
                                organization: req.body.organization,
                            }
                        })
                        .then(result => {
                            res.status(200).json({ message: 'Details updated successfully', result });
                            //and we need to  update the timmings array     
                        })
                        .catch(err => { res.status(400).json({ message: 'error occured in updating details' }); })
                }
                else {
                    docDet.create(body)
                        .then(async (docdetails) => {
                            await doctor.update(
                                { _id: req._id },
                                {
                                    $push: {
                                        doctorDetails: {
                                            detailsId: docdetails._doc._id
                                        },
                                    }
                                }
                            );

                            for (i = 0; i < arrlen; i++) {
                                await doctor.update(
                                    { _id: req._id },
                                    {
                                        $push: {
                                            sessionlList: {
                                                session: arr[i]
                                            },
                                        }
                                    }
                                );
                            }
                            res.status(200).json({ message: 'Details updated successfully', docdetails });
                        })

                        .catch((err) => {
                            res.status(400).json({ message: 'error Occured in creating the details of doctor' });
                        })
                }
            })
            .catch((err) => {
                res.status(400).json({ message: 'error Occured in finding the doctor details in docdet' });
            })
    },
}