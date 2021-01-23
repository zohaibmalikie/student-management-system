const express = require('express');
const router = express.Router();
const { Department } = require('../models/department');
router.post('/add', (req, res, next) => {
    var dname = req.body.dname
    const newDepartment = new Department();
    newDepartment.dname = dname;
    newDepartment
        .save()
        .then(result => {
            return res.status(200).json({ success: true, result, message: 'Deparment added successfully' })
        })
        .catch(error => {
            return res.status(501).json({ success: false, error, message: 'Internal server error' })
        })
})

module.exports = router