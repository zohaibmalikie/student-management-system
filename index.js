const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const breadcrumb = require('express-url-breadcrumb');
const multer = require('multer');
const { Attendance } = require('./models/attendance');
const moment = require('moment');
const { Student } = require('./models/student');
const { User } = require('./models/user');
const { StudentFee } = require('./models/feeManagement');

const app = express();

// Load Routes
const students = require('./routes/students');
const users = require('./routes/users');
const courses = require('./routes/courses');
const fees = require('./routes/fee-mgmt');
const api = require('./routes/api');
const uploads = require('./routes/uploads');
const department = require('./routes/department');
const attendance = require('./routes/attendance');

// Passport Config.
require('./config/passport')(passport);

// Connecting to MongoDB...
const mongoose = require('mongoose');
let environment = 'dev';
// const localURI = 'mongodb://localhost:27017/student-mgmt-sys';
const mongoURI = 'mongodb://mudassir123:mudassir123@ds149874.mlab.com:49874/student-mgt-sys';
mongoose.connect(mongoURI, {
    useNewUrlParser: true
})
    .then(() => console.log('Connected to MongoDB Server...'))
    .catch(err => console.error('Error occured connecting to MongoDB...', err));



// Load Helpers
const {
    paginate,
    select,
    if_eq,
    select_course
} = require('./helpers/customHelpers');

const {
    ensureAuthenticated,
    isLoggedIn
} = require('./helpers/auth');

// Express Handlebars Middleware.

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        paginate: paginate,
        select: select,
        if_eq: if_eq,
        select_course: select_course
    }
}));

app.set('view engine', 'handlebars');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express URL Breadcrumbs
app.use(breadcrumb());

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

// Express Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.user || null;
    next();
});
// Home Route
app.get('/', [isLoggedIn], (req, res) => {
    res.render('home', {
        title: 'Welcome',
        breadcrumbs: false,
        layout: 'home'
    });
});

// Dashboard Route
// app.get('/dashboard', [ensureAuthenticated], (req, res) => {
app.get('/dashboard', async (req, res) => {
    let getStds = await Student.find({});
    let totalStds = Object.keys(getStds).length;
    let requests = await User.find({ request: false });
    let fees = await StudentFee.find({});
    // console.log('fees :', fees)
    //console.log(req.originalUrl);
    res.render('dashboard', {
        title: 'Dashboard',
        breadcrumbs: true,
        totalStds,
        requests: requests.length,
        fees: fees.length
    });
});

app.get('/api', (req, res) => {
    res.render('api');
})

app.get('/errors', (req, res) => {
    res.render('errors', {
        title: '404 - Page Not Found.'
    });
});
// Attendances Pages
app.get('/attendance', async (req, res) => {
    // console.log("req", req.session.passport.user);
    const allAttendance = await Attendance.find({});
    res.render('attendance', {
        title: 'attendance',
        breadcrumbs: true,
        allAttendance,
    });
});
app.get('/attendance/add', (req, res) => {
    res.render('attendance/add', {
        title: 'attendance',
        breadcrumbs: true
    });
});
app.get('/marks', (req, res) => {
    res.render('marks', {
        title: 'marks',
        breadcrumbs: true,
        marks: [
            { bCode: 'CS101', bName: 'Introduction to programming', smes: 'Fall 2018', credits: 3, grade: 'A+', points: 4 },
            { bCode: 'CS202', bName: 'DLD', smes: 'Fall 2018', credits: 3, grade: 'A', points: 3 },
            { bCode: 'CS501', bName: 'Data Structure', smes: 'Fall 2018', credits: 3, grade: 'B', points: 2 },
        ]
    });
});

// Use Routes
app.use('/students', students);
app.use('/users', users);
app.use('/courses', courses);
app.use('/fee-management', fees);
app.use('/api', api);
app.use('/uploads', uploads);
app.use('/department', department);
app.use('/attendance', attendance);

const port = process.env.PORT || 8000;
app.set('port', port);
app.listen(port, () => console.log(`Server started on port : ${port}`));