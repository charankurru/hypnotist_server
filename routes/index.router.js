const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const ctrlPost = require('../controllers/post.controllers');

const ctrlSemi = require('../controllers/semiUser.controller');

const dRCtrl = require('../controllers/doctor.controller');

const appointCtrl = require('../controllers/appointment.controller');

const DocDetails = require('../controllers/doctor-details.controller');

const jwtHelper = require('../config/jwtHelper');

const jwtHelper2 = require('../config/helpers');

//Authentication for User
router.post('/register', ctrlUser.register);
router.post('/googleuser', ctrlUser.google)
router.post('/authenticate', ctrlUser.authenticate);
router.post('/google', ctrlUser.google);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);

//Getting userProfile Details
router.get('/getbyname/:naam', ctrlSemi.getbyNaam);

//updating userprofile
router.post('/updatefav', jwtHelper.verifyJwtToken, ctrlSemi.addfavdoctor)



// Authentication for Doctor  getSingleDoctor
router.post('/Dr.register', dRCtrl.register);
router.post('/Dr.authenticate', dRCtrl.authenticate);
router.get('/DR.getDoctorbyId/:id', jwtHelper.verifyJwtToken, dRCtrl.getSingleDoctors)

router.get('/getSingleDoctor/:id', jwtHelper.verifyJwtToken, dRCtrl.getSingleDoctors)
router.get('/getDoctorAppointments', jwtHelper.verifyJwtToken, dRCtrl.GetDocappointements)


//getting Doctorslist
router.get('/getDoctorsList', dRCtrl.getDoctors);

//Requesting an Appointment
router.post('/postappointment', jwtHelper.verifyJwtToken, appointCtrl.postappointment);
router.get('/getappointements', jwtHelper.verifyJwtToken, appointCtrl.getappointements);

//checking the posibilities of free time
router.post('/checkpossible', appointCtrl.findPosibility);


//post Doctor Details for Doctors  for updating profile
router.post('/updateDocDet', jwtHelper.verifyJwtToken, DocDetails.PostDocDetails);

//getting appointmentes for calender

router.get('/GetAppointsForCalender', jwtHelper.verifyJwtToken, appointCtrl.GetAppointsForCalender);


// post form
// router.post('/postfeed', jwtHelper.verifyJwtToken, ctrlSemi.postfeed);

// router.get('/getfeed', ctrlPost.getfeed);

// router.post('/addlike', jwtHelper.verifyJwtToken, ctrlPost.addlike);

// router.post('/addcomment', jwtHelper.verifyJwtToken, ctrlPost.addcomment);

// router.get('/getcomment/:id', jwtHelper.verifyJwtToken, ctrlPost.getcomment);

// router.get('/getUsers', ctrlPost.getUsers);

// router.post('/friends', jwtHelper.verifyJwtToken, ctrlPost.addfriends);

// router.get('/getsingleUser/:id', ctrlPost.getSingleUser);

// router.post('/unfollow', jwtHelper.verifyJwtToken, ctrlSemi.UnFollowUser);

// router.post('/removeuser', jwtHelper.verifyJwtToken, ctrlSemi.removeUser);

// router.post('/mark/:id', jwtHelper.verifyJwtToken, ctrlSemi.MarkNotification);


module.exports = router;
