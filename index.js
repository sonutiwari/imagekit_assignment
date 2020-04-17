// getting all the dependencies.
const express = require("express");
const router = require("./routes/index");
const flash = require("req-flash");
const session = require("express-session");
const dotenv = require("dotenv");
mailer = require("express-mailer");

// Create an app.
const app = express();

// Getting configurations.
dotenv.config();

// Set up mailer
mailer.extend(app, {
  from: "no-reply@example.com",
  host: "smtp.gmail.com", // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: "SMTP", // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: "ankorha@gmail.com",
    pass: process.env.PASSWORD,
  },
});

// Define PORT to run.
const PORT = process.env.PORT || 3000;

// Middleware For parsing URL data.
app.use(express.urlencoded({ extended: true }));

// Middleware For parsing JSON data.
app.use(express.json());

// Setup an express session for flash messages.
app.use(
  session({
    secret: "Sonu Tiwari",
    resave: false,
    saveUninitialized: true,
  })
);

// Set up flash middleware.
app.use(flash());

// set up the view engine
app.set("view engine", "ejs");

// Setup views directory.
app.set("views", "./views");

// Use express router.
app.use("/", router);

// Run the server.
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("App is running on PORT", PORT);
});
