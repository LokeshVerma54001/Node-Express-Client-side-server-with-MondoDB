const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    roles:{
        //everyone will be assigned user by default
        User:{
            type: Number,
            default: 2001,
        },
        Editor: Number,
        Admin: Number
    },password: {
        type: String,
        required: true
    },
    refreshToken: String
});

//mongo will search for lower case plural of the virson
//of our model, ie for this Employee it will be employees
module.exports = mongoose.model('User', userSchema);