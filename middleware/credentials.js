const allowedOrigins = require('../config/allowedOrigins');

//just a bit of extra security
const credentials = (req, res, next)=>{
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)){
        res.handler('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;