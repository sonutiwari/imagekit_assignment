const userModel = require('../models/user_model');
const AuthController = {};
AuthController.showRegistrationPage = (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let showCaptcha = false;
    if (ip) {
        if (isRequestThreshHoldCrossed(ip)){
            showCaptcha = true;
        }
    }
    return res.render('sign_up', {title: 'Sign Up', showCaptcha: showCaptcha});
}

AuthController.registerUser = (req, res) => {
    return res.send("Working");
}

AuthController.registerSuccess = (req, res) => {
    return res.send("Working");
}

AuthController.pageNotFound = (req, res) => {
    return res.status(404).send("Page not found");
}

function isRequestThreshHoldCrossed(ip){
    return new Promise(resolve=>{
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        userModel.countDocuments({created_on: {$gte: startOfToday}}, function (err, count) { 
            resolve(count > 3);
        });
    })
}
module.exports = AuthController;