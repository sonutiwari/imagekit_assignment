// Imports.
const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// set env.
dotenv.config();

// Get db connection.
const db = require("../configs/db_config");

// Create auth object.
const AuthController = {};

// Threshhold for showing captcha.
const THRESHOLD = 0;

// show registration form.
AuthController.showRegistrationPage = (req, res) => {
  // Get IP address.
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Get today's date.
  var now = new Date();

  // Go to midnight today.
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get all the docs created today with this IP.
  userModel.countDocuments(
    { ip: ip, createdAt: { $gte: startOfToday } },
    function (err, count) {
      console.log(count, "Count", "IP", ip);

      if (count >= THRESHOLD) {
        // Show captcha.
        return res.render("sign_up", {
          title: "Sign Up",
          showCaptcha: true,
          recaptcha: res.recaptcha,
          passwordErr: req.flash("passwordError"),
          success: req.flash("success"),
          dbError: req.flash("dbError"),
          captchaError: req.flash("captchaError"),
        });
      } else {
        // Hide captcha.
        return res.render("sign_up", {
          title: "Sign Up",
          showCaptcha: false,
          recaptcha: res.recaptcha,
          passwordErr: req.flash("passwordError"),
          success: req.flash("success"),
          dbError: req.flash("dbError"),
          captchaError: req.flash("captchaError"),
        });
      }
    }
  );
};

// Register user.
AuthController.registerUser = async (req, res) => {
  // Get IP.
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let password = req.body.password;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT)
    );
  } catch (err) {
    req.flash("dbError", "Error in Password Hashing" + err);
    return res.redirect("/");
  }
  if (!req.recaptcha.error) {
    // Captcha is filled.
    // success code
    if (isValidPassword(req.body.password)) {
      // Rest of the data is validated on front end.
      let data = req.body;
      data.password = hashedPassword;
      data.ip = ip;
      let document = new userModel(data); // create document.
      document.save((err, resp) => {
        if (err) {
          req.flash(
            "dbError",
            "Error in Database, Probably Email already exists"
          );
          return res.redirect("/");
        } else {
          req.flash("success", "Saved data successfully into DB");
          return res.redirect("/");
        }
      });
    } else {
      // Invalid password.
      req.flash("passwordError", "Invalid password");
      return res.redirect("/");
    }
  } else {
    // captch is not filled (2 cases: 1. hidden, 2. shown)
    // error code
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    userModel.countDocuments(
      { ip: ip, createdAt: { $gte: startOfToday } },
      function (err, count) {
        if (count < THRESHOLD) {
          // Case 1.
          if (req.body) {
            if (isValidPassword(req.body.password)) {
              // Rest of the data is validated on front end.
              let data = req.body;
              data.password = hashedPassword;
              data.ip = ip;
              let document = new userModel(data);
              document.save((err, resp) => {
                if (err) {
                  req.flash(
                    "dbError",
                    "Error in Database, Probably Email already exists"
                  );
                  return res.redirect("/");
                } else {
                  req.flash("success", "Saved data successfully into DB");
                  return res.redirect("/");
                }
              });
            } else {
              // Invalid password.
              req.flash("passwordError", "Invalid Password");
              return res.redirect("/");
            }
          }
        } else {
          // Case 2.
          req.flash("captchaError", req.recaptcha.error + " Invalid captcha");
          return res.redirect("/");
        }
      }
    );
  }
};
AuthController.showLoginPage = async (req, res) => {
  return res.render("login", {
    title: "LogIn",
    showCaptcha: true,
    recaptcha: res.recaptcha,
    passwordErr: req.flash("passwordError"),
    success: req.flash("success"),
    dbError: req.flash("dbError"),
    captchaError: req.flash("captchaError"),
  });
};

/**
 * This function will control user login flow.
 */
AuthController.loginUser = async (req, res) => {
  const { email, password } = req.body;
  let loginData;
  try {
    loginData = await userModel.findOne({
      email: email,
    });
  } catch (error) {
    req.flash("dbError", "Error while trying to the data" + error);
    return res.redirect("/login");
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.compare(password, loginData.password);
  } catch (err) {
    req.flash("dbError", "Password didn't Match" + err);
    return res.redirect("/login");
  }
  if (hashedPassword) {
    // Login successful
    req.flash("success", "Login Successful");
  } else {
    req.flash("dbError", "Password didn't Match");
  }
  return res.redirect("/");
};

// Page not found.
AuthController.pageNotFound = (req, res) => {
  return res.status(404).send("Page not found");
};

// Password validation.
function isValidPassword(password) {
  var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return password.match(regex);
}

// Export the module.
module.exports = AuthController;
