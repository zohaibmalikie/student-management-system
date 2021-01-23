const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    outTime: {
        type: String,
    },
    in: {
        type: Boolean
    },
    user: {
        type: String
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

exports.Attendance = Attendance;