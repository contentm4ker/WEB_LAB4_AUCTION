var express = require('express');
var app = express();

var path = require('path');

var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/*
io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        let time = (new Date()).toLocaleTimeString();
        if (msg.type === "connect") {
            socket.send(
                {
                    type: "connect",
                    message: `${time} КУКУ ЕПТА ${msg.name}`
                });
            socket.broadcast.send(
                {
                    type: "connect",
                    message: `${time} Пользователь ${msg.name} зашел.`
                });
        }  else {
            if (msg.type === "msg") {
                let obj =
                    {
                        type: "msg",
                        message: `${time} ${msg.name}: ${msg.value}`
                    };
                socket.send(obj);
                socket.broadcast.send(obj);
            }
        }
    });
});*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/', indexRouter);

module.exports = app;