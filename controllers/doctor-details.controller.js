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
                res.status(400).json({ message: 'error Occured' });
            })

    },
}