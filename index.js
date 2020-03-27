// getting all the dependencies.
const express =  require('express');
const router  = require('./routes/index');
const flash   = require('req-flash');
const session = require('express-session');

// Create an app.
const app = express();

// Define PORT to run.
const PORT = process.env.PORT || 3000;

// Middleware For parsing URL data.
app.use(express.urlencoded({extended: true}));

// Middleware For parsing JSON data.
app.use(express.json());

// Setup an express session for flash messages.
app.use(session({
    secret: 'Sonu Tiwari',
    resave: false,
    saveUninitialized: true
}));

// Set up flash middleware.
app.use(flash());

// set up the view engine
app.set('view engine','ejs');

// Setup views directory.
app.set('views','./views');

// Use express router.
app.use('/', router);

// Run the server.
app.listen(PORT, (err)=>{
    if (err) console.log(err);
    else console.log('App is running on PORT', PORT);
});