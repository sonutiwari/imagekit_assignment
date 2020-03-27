// Get controller object.
const authController = require('../controllers/index');

// Get express router object.
const Router = require('express').Router();

// get captcha object.
var Recaptcha = require('express-recaptcha').RecaptchaV2;

//import Recaptcha from 'express-recaptcha'
const API_KEY = '6LeGTeQUAAAAADkEPhrGDWC6isBisbF783xZVi18';
const SECRET_KEY = '6LeGTeQUAAAAAB9uroVWWcrBjzQ9jSnBuH_8y-9z';

// create captcha object.
var recaptcha = new Recaptcha(API_KEY, SECRET_KEY, {callback: 'cb'});

// Set up routes.
Router.get('/', recaptcha.middleware.render, authController.showRegistrationPage);
Router.post('/register', recaptcha.middleware.verify, authController.registerUser);

// 404.
Router.get('/*', authController.pageNotFound);

// Export this module.
module.exports  = Router;
