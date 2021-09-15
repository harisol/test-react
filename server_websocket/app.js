const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const uc = require('upper-case');
const myFunction = require('./myfunction');
const Artimatics = require('./mymodule.js');

const hostname = '127.0.0.1';
const port = 3001;

const routes = ['/', '/form', '/promise', '/calculator'];

/**
 * if called with await, it will return string. instead, it will return promise
 */
async function callingPromise() {
    function myDisplayer(val) {
        console.log(`result:`, val);
    }

    let result = 'unchanged';

    /* await won't wait myPromise to finish if put inside looping with callback, such as forEach or map. */
    // [1, 2, 3, 0].forEach(v => {
    //     const result = await myFunction.myPromise(v).catch(e => { console.log('x') });
    //     console.log('y');
    // });

    /* await will wait myPromise to finish if put inside "for of" */
    for (const val of [1, 0]) {
        await myFunction.myPromise(val).then(v => {
            myDisplayer(`this is ${v.name} who lives in ${v.address}`);
            result = 'changed';
        }).catch(error => {
            myDisplayer(error);
        });

        // this will be executed first if myPromise is not called with await
        console.log(`you're finished calling promise with param ${val}`);
    }

    myFunction.logB();
    myFunction.logA();
    myFunction.currentDate();

    return result;
}


// build http server
// res.end() should be called in the end, or browser will keep loading
const server = http.createServer(async (req, res) => {

    const method = req.method;
    const currentUrl = new URL(`http://${hostname}:${port}${req.url}`);
    const pathname = currentUrl.pathname;
    const searchParams = currentUrl.searchParams;
    const x = searchParams.get('somekey');
    
    console.log('current path is', pathname);

    if (!routes.includes(pathname)) {
        // return 404
        res.statusCode = 404;
        return res.end();
    }

    if (pathname == '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write(uc.upperCase('Hello World'));
        fs.readFile('demofile1.html', function (err, data) {
            res.write(data);
            res.end();
        });
    }

    if (pathname == '/calculator') {
        const number1 = searchParams.get('number1');
        const number2 = searchParams.get('number2');
        if (!number1 || !number2) {
            res.write('required query: number1, number2');
            return res.end();
        }

        const op = new Artimatics(number1, number2);
        res.write(`Addition: ${op.add()}\n`);
        res.write(`subtraction: ${op.subtract()}\n`);
        res.write(`Multiplication: ${op.multiply()}\n`);
        res.write(`Division: ${op.divide()}`);
        return res.end();
    }

    if (pathname == '/promise') {
        callingPromise().then(v => {
            res.write(`result is ${v}`);
            res.end();
        });
    }

    if (pathname == '/form') {
        if (method == 'POST') {
            console.log('form submitted!');
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                res.write(`upload success! file name: ${fields.gambar}`);
                res.end();
            });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.readFile('upload.html', function (err, data) {
                res.write(data);
                res.end();
            });
        }
    }
    
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------

// build a websocket
// https://github.com/AvanthikaMeenakshi/node-websockets
const webSocketServer = require('websocket').server;
const { exception } = require('console');
const wsServer = new webSocketServer({
    httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];


// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

const sendMessage = (json) => {
    // We are sending the current data to all connected clients
    Object.keys(clients).map((client) => {
        clients[client].sendUTF(json);
    });
}

const typesDef = {
    USER_EVENT: "userevent",
    CONTENT_CHANGE: "contentchange"
}

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const dataFromClient = JSON.parse(message.utf8Data);
            const json = { type: dataFromClient.type };
            if (dataFromClient.type === typesDef.USER_EVENT) {
                users[userID] = dataFromClient;
                userActivity.push(`${dataFromClient.username} joined to edit the document`);
                json.data = { users, userActivity };
            } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
                editorContent = dataFromClient.content;
                json.data = { editorContent, userActivity };
            }
            sendMessage(JSON.stringify(json));
        }
    });

    // user disconnected
    connection.on('close', function (connection) {
        if (!users[userID]) {
            return;
        }

        const json = { type: typesDef.USER_EVENT };
        console.log((new Date()) + " Peer " + userID + " disconnected.");
        userActivity.push(`${users[userID].username} left the document`);
        json.data = { users, userActivity };
        delete clients[userID];
        delete users[userID];
        sendMessage(JSON.stringify(json));
    });
});