$(document).ready(function(){
    chat();
    $('#send').on('click', send);

    var socket;

    var isRight = true;


    $("#resizableFrame, #res-msg-inp").draggable({
        cursor: "move"
    });


    $("#resizableFrame").resizable({
        maxHeight: 723,
        maxWidth: 750,
        minHeight: 200,
        minWidth: 200
    });


    function chat() {
        socket = io.connect('http://localhost');
        socket.on('connect', function () {
            socket.json.emit('hello', {'name': $('#username').text()});
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
            socket.on('startauction', function (msg) {
                $('#info-pannel').show();
                $('#img-info').show();
                clearInterval(inter);
                sec="0";
                refresh(msg.time);
                $('#pic-name').text(msg.author + ' / ' + msg.name);
                $('#pic-img, #pic-img-big').prop('src', msg.imgsrc);
                $('#disc').text(msg.disc);
                $('#info').text(msg.info);
            });
        });
    }


    function send() {
        if (socket) {
            socket.json.emit('msg', {name: $('#username').text(), value: $('#msg').val()});
        }
    }
});


var sec=0;
var inter;
function refresh(min)
{
    if(--sec == -1){
        sec = 59;
        min = min - 1;
    }
    let time=(min <= 9 ? "0"+min : min) + ":" + (sec <= 9 ? "0" + sec : sec);
    if(document.getElementById){timer.innerHTML=time;}
    inter=setTimeout(`refresh(${min})`, 1000);
    if(min=='00' && sec=='00'){
        sec="0";
        clearInterval(inter);
    }
}