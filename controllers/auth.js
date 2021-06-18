const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');


const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY);
// const TeacherUser = require('../models/teacher');
// const StudentUser = require('../models/student');
const User = require('../models/user');

exports.getSignUp = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signInpage', {
        pagetitle: 'SignUp',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};


exports.postSignIn = (req, res, next) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const radioOptions = req.body.inlineRadioOptions;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signInpage', {
            pagetitle: 'SignUp',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }

    bcrypt.hash(password, 12).then(hashedPw => {
        const user = new User({
            email: email,
            password: hashedPw,
            userType: radioOptions,
            userName: userName,
            courseList: []
        });
        return user.save();
        })
        .then(result => {
            res.redirect('/auth/login');
            return sgMail
            .send({
                to: email,
                from: '0126cs181091@oriental.ac.in',
                subject: 'SignUp Successfull!',
                html: '<h1>You successfully signed up!</h1>'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};



exports.getLogIn = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/logInpage', {
        pagetitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const radioOptions = req.body.inlineRadioOptions;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/logInpage', {
            pagetitle: 'Login',
            path: 'login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array()
        });
    }
    User.findOne({ email: email, userType: radioOptions })
        .then(user => {
            if (!user) {
                // req.flash('error', 'Invalid email or password.');
                return res.status(422).render('auth/logInpage', {
                    pagetitle: 'Login',
                    path: 'login',
                    errorMessage: 'Invalid email or password',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                });
            }

            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (user.userType === 'student') {
                                res.redirect('/student/dashboard');
                            } else if (user.userType === 'teacher') {

                                res.redirect('/teacher/dashboard');
                            } else if (user.userType === 'admin') {

                                res.redirect('/admin/dashboard');
                            }
                        });
                    }
                    // req.flash('error', 'Invalid email or password.');
                    return res.status(422).render('auth/logInpage', {
                        pagetitle: 'Login',
                        path: 'login',
                        errorMessage: 'Invalid email or password',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
                }).catch(err => {
                    res.redirect('auth/logInpage');
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};



exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};


exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        pagetitle: 'Reset Password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'no account found with that email id');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                sgMail
                .send({
                    to: req.body.email,
                    from: '0126cs181091@oriental.ac.in',
                    subject: 'Password Reset',
                    html: `<p>you requested reset password</p>
                    <p>click this <a href='http://localhost:3000/auth/reset/${token}'>link</a> to set the new password</p>`
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/newPassword', {
                pagetitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/auth/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

