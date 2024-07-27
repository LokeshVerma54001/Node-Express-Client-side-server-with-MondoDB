const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    }
});

//mongo will search for lower case plural of the virson
//of our model, ie for this Employee it will be employees
module.exports = mongoose.model('Employee', employeeSchema);