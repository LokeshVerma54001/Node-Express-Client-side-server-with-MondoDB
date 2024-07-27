//this file is for the cors configuration

//which domains can access your backend server is the white list
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) =>{
        //important!----------
        //remove !origin after devlopment (its for whitelisting
        // local host during devlopement)
        if(allowedOrigins.indexOf(origin)!==-1 || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },credentials:true,
    optionsSuccessStatus:200
};

module.exports = corsOptions;