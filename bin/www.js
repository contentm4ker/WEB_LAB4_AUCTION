// @flow

var app = require('../app');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var debug = require('debug')('lab4-auction-event:server');
var logger = require('../logger');


var port = 80;
server.listen(port, ()=>{
    logger.verbose(`HTTP server started at http://localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);


//loading  auction data from json
var auctionInfo;
if(process.env.NODE_ENV !== 'test') {
    auctionInfo = require('../data/auction_settings');
} else {
    auctionInfo = require('../data/test');
}
var auctTimeSetts = auctionInfo.auctSettings;
var paintings = [];
var auctMembers = [];
for (let key in auctionInfo.paintings) {
    auctionInfo.paintings[key].ind = Number(key);
    paintings.push(auctionInfo.paintings[key]);
}
for (let key in auctionInfo.auctMembers) {
    auctionInfo.auctMembers[key].ind = Number(key);
    auctMembers.push(auctionInfo.auctMembers[key]);
}

//end of loading data


io.sockets.on('connection', (socket) => {
    socket.on('hello', (msg) => {
        let time = (new Date()).toLocaleTimeString();
        socket['name'] = msg.name;
        send(socket, `${msg.name} присоединился`, `${time}`)
    });
    socket.on('msg', (msg) => {
        let time = (new Date()).toLocaleTimeString();
        send(socket, `${socket['name']}: ${msg.value}`, `${time}`);
    });
    socket.on('disconnect', (msg) => {
        if (socket['name']) {
            let time = (new Date()).toLocaleTimeString();
            send(socket, `${socket['name']} вышел`, `${time}`);
        }
    });
    socket.on('startauction', (msg) => {
        socket.broadcast.emit('startauction', {
            info: msg.msg
        });
    });
    socket.on('auctionstep', (msg) => {
        socket.broadcast.emit('auctionstep', {
            info: msg.msg,
        });
    });
    socket.on('researchstep', (msg) => {
        socket.broadcast.emit('researchstep', {
            info: msg.msg
        });
    });
    socket.on('changepicture', (msg) => {
        socket.broadcast.emit('changepicture', {
            ind: msg.ind,
            name: paintings[msg.ind].name,
            author: paintings[msg.ind].author,
            imgsrc: paintings[msg.ind].imgPath,
            price: paintings[msg.ind].startPrice,
            disc: paintings[msg.ind].discription,
            min: paintings[msg.ind].step.min,
            max: paintings[msg.ind].step.max
        });
    });
    socket.on('refreshtimer', (msg) => {
        socket.broadcast.emit('refreshtimer', {
            time: msg.time
        });
    });
    socket.on('setcurrentbet', (msg) => {
        socket.json.emit('setcurrentbet', {
            money: msg.money
        });
        socket.broadcast.emit('setcurrentbet', {
            money: msg.money
        });
    });
    socket.on('updatepictureinfo', (msg) => {
        socket.broadcast.emit('updatepictureinfo', {
            name: msg.name,
            price: msg.price,
            id: msg.id
        });
    });
    socket.on('updatemoney', (msg) => {
        socket.broadcast.emit('updatemoney', {name: msg.name, money: msg.money});
    });
    socket.on('stopauction', (msg) => {
        socket.broadcast.emit('stopauction', {ind: msg.ind});
    });
});

function send(socket, msg, time) {
    socket.json.emit('msg', {'message': msg, 'time': time});
    socket.broadcast.emit('msg', {'message': msg, 'time': time});
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = server;