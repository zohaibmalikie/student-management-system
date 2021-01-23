const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    departmentName: {
        type: String,
    },
    courseDuration: {
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    courseFee: {
        type: Number,
    },
    intake: {
        type: String,
    },
});
function validateCourse(course) {
    // const schema = {
    //     name: Joi.string().required().label(' Full Name '),
    //     email: Joi.string().email().required().label(' Email Address '),
    //     password: Joi.string().required().label(' Password '),
    //     password2: Joi.string().required().label(' Confirm Password '),
    //     role: Joi.string().required().label(' User Role '),
    //     //isAdmin: Joi.boolean().required().label(' isAdmin ')
    // }

    // return Joi.validate(user, schema);
    return false
}

const Course = mongoose.model('Courses', courseSchema);

exports.Course = Course;
exports.validateCourse = validateCourse