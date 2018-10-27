var isRight = true;
$("#resizableFrame").draggable({
    cursor: "move",
    cursorAt: {
        top: 5,
        left: 2
    }
});

$("#resizableFrame").resizable({
    maxHeight: 723,
    maxWidth: 750,
    minHeight: 200,
    minWidth: 200
});

var socket = io.connect('http://localhost');
socket.on('connect', function () {
    socket.on('msg', function (msg) {
        if (isRight) {
            $('#users').append(`<div class="container"><p style="word-wrap: break-word;">${msg.message}</p>
                    <span class="time-right">${msg.time}</span></div>`)
            isRight = false;
        } else {
            $('#users').append(`<div class="container darker"><p style="word-wrap: break-word;">
                    ${msg.message}</p><span class="time-left">${msg.time}</span></div>`)
            isRight = true;
        }
    });
});