$(document).ready(function(){
    var isRight = true;
    $("#resizableFrame, #admin-panel").draggable({
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

var pic_num = 0;
var research_time = $('#researchPause').text().split(' ')[0];
var timeout = $('#timeout').text().split(' ')[0];
function nextStepAuction(time) {
    socket.json.emit('startauction', {time: time, ind: pic_num});
    refresh(time);
}

$('#start').on('click', function() {
    nextStepAuction(research_time);
    $('#start').hide();
});

var sec=0;
var isNewAuctStep = true;
function refresh(min)
{
    if(--sec == -1) {
        sec = 59;
        min = min - 1;
    }
    if (sec <= 9) {sec = "0" + sec;}
    time = (min <= 9 ? "0"+min : min) + ":" + sec;
    if (document.getElementById){timer.innerHTML=time;}
    inter = setTimeout(`refresh(${min})`, 1000);
    // действие, если таймер 00:00
    if(min=='00' && sec=='00'){
        sec="0";
        clearInterval(inter);
        if (isNewAuctStep) {
            nextStepAuction(timeout);
            pic_num++;
            isNewAuctStep = false;
        } else {
            isNewAuctStep = true;
            nextStepAuction(research_time);
        }


    }
}