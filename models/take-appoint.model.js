const mongoose = require('mongoose');
const User = mongoose.model('User');

const appointSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    username: { type: String, default: ' ' },
    doctorname: { type: String, default: ' ' },
    problem: { type: String, default: ' ' },
    appointmentDate: { type: String, default: '' },
    sessionTimings: { type: String, default: '' },

    created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Appointment', appointSchema);
