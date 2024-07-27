//setting up logs emmitter
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
const { ca } = require('date-fns/locale');
class Emitter extends EventEmitter { };


// initialize object
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) =>logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response)=>{
    try{
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image')?'utf-8':'');
        //if raw data is json file then parse it to json data
        //otherwise show raw data
        const data = contentType === 'application/json'
            ?JSON.parse(rawData):rawData;
        response.writeHead(
            filePath.includes('404.html')?404:200, 
            {'Content-Type': contentType});
        response.end(
            contentType === 'application/json' ? JSON.stringify(data):data
        );
    }catch(err){
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.message}`, `errLog.txt`);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res)=>{
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, `reqLog.txt`);
    
    const extension = path.extname(req.url);

    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'text/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    let filePath = contentType === 'text/html' && req.url === '/'
        ?path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ?path.join(__dirname, 'views', req.url, 'index.html')
            :contentType === 'text/html'
                ?path.join(__dirname, 'views', req.url)
                :path.join(__dirname, req.url);

    // makes the .html extention not required in the browser
    if(!extension && req.url.slice(-1)!=='/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        //then server the file
        serveFile(filePath, contentType, res);
    }else{
        //404
        //301 redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                //server a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
    // more efficient than below method but still inefficient 
    // let path;
    // switch(req.url){
    //     case '/':
    //         res.statusCode = 200;
    //         path = path.join(__dirname, 'views', 'index.html');
    //         fs.readFile(path, 'utf-8' ,(err, data)=>{
    //             res.end(data);
    //         });
    //         break;
    // }       
     

    // less efficient
    // let path;
    // if(req.url === '/' || req.url === 'index.html'){
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     path = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(path, 'utf-8' ,(err, data)=>{
    //         res.end(data);
    //     });
    // }
});

server.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`));


// add listerner for the log event 


// setTimeout(()=>{
//     // Emit event
//     myEmitter.emit('log', 'Log event emitted');
// }, 2000); 

// myEmitter.emit('log', 'Log event emitted');
