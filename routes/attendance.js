const express = require('express');
const router = express.Router();
const { Attendance } = require('../models/attendance');
const moment = require('moment');
const { User } = require('../models/user');
router.post('/in', async (req, res, next) => {
    console.log(req);

    const date = moment().format('DD-MMM-YYYY');
    const time = moment().format("HH:mm");
    let todayCheck = await Attendance.findOne({ date });
    let findUser = await User.findById({ _id: req.session.passport.user });
    let attendanceBool = todayCheck !== null ? true : false;
    if (attendanceBool) {
        return res.status(403).json({ statusCode: 403, success: false, message: 'Attendance already added' })
    }
    const newAttendance = new Attendance();
    newAttendance.date = date;
    newAttendance.time = time;
    newAttendance.in = true;
    newAttendance.user = findUser.name;
    newAttendance
        .save()
        .then(result => {
            return res.status(200).json({ success: true, result, message: 'Attendance added successfully' })
        })
        .catch(error => {
            return res.status(501).json({ success: false, error, message: 'Internal server error' })
        })
});

router.post('/out', async (req, res, next) => {
    // console.log("req", req.session.passport.user);
    const date = moment().format('DD-MMM-YYYY');
    const time = moment().format("HH:mm");
    let todayCheck = await Attendance.findOne({ date });
    let findUser = await User.findById({ _id: req.session.passport.user });
    // console.log(findUser.name );
    let attendanceBool = todayCheck !== null ? true : false;
    if (attendanceBool) {
        todayCheck.in = false;
        todayCheck.outTime = time;
        todayCheck.user = findUser.name;
        await todayCheck.save()
        return res.status(200).json({ statusCode: 200, success: true, message: 'You are out successfulyy' })
    }
    else return res.status(403).json({ statusCode: 403, success: false, message: 'Please add your attendance first' })
})
router.get('/all_attendances', (req, res, next) => {
    Attendance.find({})
        .exec()
        .then(result => {
            return res.status(200).json({ success: true, result, message: 'Success', result })
        })
        .catch(error => {
            return res.status(501).json({ success: false, error, message: 'Internal server error' })
        })
})
module.exports = router