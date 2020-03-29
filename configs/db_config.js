// Get mongoose lib.
const mongoose = require('mongoose');

// Conection String.
const CONNECTION_STRING = "mongodb+srv://sonutj:Sonu%401996@restaurant-lcbzk.mongodb.net/test?retryWrites=true&w=majority";

// local url.
const LOCAL_URL = 'mongodb://127.0.0.1:27017/imagekit';

// Connect to the localhost.
mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});

// Get connection object.
const db = mongoose.connection;

// bind error to console.
db.on('error', console.error.bind(console,"Error connecting to Mongodb"));

// Show success msg.
db.once('open',function(){
    console.log('Connected to db :: MongoDB')
});

// Export the module.
module.exports = db;
