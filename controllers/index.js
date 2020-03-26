const userModel = require('../models/user_model');
const db = require('../configs/db_config');
const AuthController = {};
const THRESHOLD = 3;
AuthController.showRegistrationPage = (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    userModel.countDocuments({ip: ip, createdAt: {$gte: startOfToday}}, function (err, count) { 
        console.log(count, "Count", "IP", ip);
        if (count >= THRESHOLD) {
            return res.render('sign_up', { 
                title: 'Sign Up', 
                showCaptcha: true, 
                recaptcha: res.recaptcha
            });
        } else {
            return res.render('sign_up', { 
                title: 'Sign Up', 
                showCaptcha: false, 
                recaptcha: res.recaptcha
            });
        }
    });
}

AuthController.registerUser = (req, res) => {
    if (!req.recaptcha.error) {
        // success code
        if (isValidPassword(req.body.password)){ // Rest of the data is validated on front end.
            let data = req.body;
            data.ip = ip;
            let document = new userModel(data);
            document.save((err, resp) => {
                if (err) {
                    console.log('Error in saving data, ', err);
                    return res.redirect('/');
                } else {
                    return res.redirect('/');
                }
            });
        }
        console.log('Success');
      } else {
        // error code
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        userModel.countDocuments({ip: ip, createdAt: {$gte: startOfToday}}, function (err, count) { 
            if (count < THRESHOLD) {
                if (req.body) {
                    if (isValidPassword(req.body.password)){ // Rest of the data is validated on front end.
                        let data = req.body;
                        data.ip = ip;
                        let document = new userModel(data);
                        document.save((err, resp) => {
                            if (err) {
                                console.log('Error in saving data, ', err);
                                return res.redirect('/');
                            } else {
                                return res.redirect('/');
                            }
                        });
                    }
                }
                console.log(req.body);
            } else {
                console.log('Error', req.recaptcha.error);
                return res.redirect('/');
            }
        });
        
      }
}


AuthController.pageNotFound = (req, res) => {
    return res.status(404).send("Page not found");
}

function isValidPassword(password) {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return password.match(regex);
}
module.exports = AuthController;