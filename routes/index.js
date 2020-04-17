// Get controller object.
const authController = require("../controllers/index");

// Get Environment Configuration.
const dotenv = require("dotenv");

// Get express router object.
const Router = require("express").Router();

// get captcha object.
var Recaptcha = require("express-recaptcha").RecaptchaV2;

// get environment.
dotenv.config();

// create captcha object.
var recaptcha = new Recaptcha(process.env.API_KEY, process.env.SECRET_KEY, {
  callback: "cb",
});

// Set up routes.
Router.get(
  "/",
  recaptcha.middleware.render,
  authController.showRegistrationPage
);
Router.post(
  "/register",
  recaptcha.middleware.verify,
  authController.registerUser
);
Router.get("/login", recaptcha.middleware.render, authController.showLoginPage);
Router.post("/login", recaptcha.middleware.verify, authController.loginUser);

// 404.
Router.get("/*", authController.pageNotFound);

// Export this module.
module.exports = Router;
