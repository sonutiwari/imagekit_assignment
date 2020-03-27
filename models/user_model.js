// Get mongoose library.
const mongoose = require('mongoose');

// Create user schema.
const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required: true,
        unique:true
    },
    password:{
        type : String,
        required: true
    },
    name:{
        type : String,
        required : true
    },
    ip: {
        type: String,
        required: true
    }
}, {
        timestamps : true
});

// Create user model.
const User = mongoose.model('User',userSchema);

// Export user model.
module.exports = User;
