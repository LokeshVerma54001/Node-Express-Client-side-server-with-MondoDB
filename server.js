require('dotenv').config();
const exp = require('constants');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const { error } = require('console');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect MongoDB
connectDB();

//custom middleware logger
app.use(logger);

//handle options credentials check - before CORS
//and fetch cookies credentials required
app.use(credentials);

//cross origin resource sharing
//(this is to resolve cors error while fetching the
// site from other domain like google.com)
app.use(cors(corsOptions));

//built in middleware to handle url encoded data
//int other words, form data:
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended:false}));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//server static files 
//(basically links the files as public to use by html pages)
app.use('/', express.static(path.join(__dirname, '/public')));
//routing for the subdir to public folder
app.use('/subdir', express.static(path.join(__dirname, '/public')));

//routes----------------------------------------
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/subdir', require('./routes/subdir'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
//verifyJWT will only work on employees routes
//as it is below it
app.use('/employees', require('./routes/api/employees'));
//routes end----------------------------------------


//for custom 404 error
app.all('*', (req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')){
        res.json({error:"404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);

//we will only listen to requests when mongoDB is connected
mongoose.connection.once('open', ()=>{
    console.log("connected to MongoDB");
    app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`));
});
