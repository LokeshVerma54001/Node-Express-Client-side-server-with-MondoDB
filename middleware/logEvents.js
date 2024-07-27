// npm install nodemon -g for global -D for dev dependency
console.log('testing!');
const {v4:uuid} = require('uuid');
const {format} = require('date-fns');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async(message, logName) =>{
    const dateTime = `${format(new Date(), 'yyyy/MM/dd\tHH:mm::ss')}`
    const logItem = `\n${dateTime}\t${uuid()}\t${message}`;
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname,'..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem);
    }catch(err){
        console.error(err);
    }
}

const logger = (req, res, next)=>{
    //req.headers.origin = which site is the req is comming from
    //re.url is the site url
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = {logEvents, logger};

console.log(format(new Date(), 'yyyy/MM/dd\tHH:mm::ss'))

//generates unique id each time
console.log(uuid());

console.log();