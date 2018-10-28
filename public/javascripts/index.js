$(document).ready(function(){
    $('#status').text(' ');

    $('#btn-request').hide();

    chat();

    $('#send').on('click', send);

    $('#btn-increase').on('click', increaseBet);

    $('#btn-request').on('click', function () {
        socket.json.emit('msg', {name: $('#username').text(), value: 'Подал заявку на участие'});
        $('#status').text('Вы участвуете в аукционе на данную картину').show();
        $('#btn-request').hide();
        if (isFirstRequest) my_bet = $('#money').text().split(' ')[1];
        socket.json.emit('setcurrentbet', {money: my_bet});
    });

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
                $('#img-info-auction, #btn-request').show();
                $('#info').text(msg.info);
            });
            socket.on('changepicture', function (msg) {
                $('#pic-name').text(msg.author + ' / ' + msg.name);
                $('#pic-img, #pic-img-big').prop('src', msg.imgsrc);
                $('#disc').text(msg.disc);
                $('#pictureprice').text('Цена: ' + msg.price);
            });
            socket.on('auctionstep', (msg) => {
                if ($('#status').text() == ' ') {
                    $('#status').text('');
                } else {
                    $('#currentbet').text('Текущая ставка: ' + current_bet);
                    $('#yourmoney').text('Ваша ставка: ' + my_bet);
                    $('#minstep').val(msg.min);
                    $('#maxstep').val(msg.max);
                    $('#minsteplabel').text('Минимальная ставка: ' + msg.min);
                    $('#maxsteplabel').text('Максимальная ставка: ' + msg.max);
                    $('#auctionbox').show();
                }

                $('#info').text(msg.info);
                $('#btn-request').hide();
            });
            socket.on('researchstep', (msg) => {
                $('#auctionbox').hide();

                $('#status').text(' ').hide();
                $('#info').text(msg.info);
                $('#btn-request').show();
            });
            socket.on('refreshtimer', function (msg) {
                clearInterval(inter);
                sec="0";
                refresh(msg.time);
                if ($('#status').text() == '') {
                    $('#status').text('Вы не принимаете участие в торгах, ожидайте').show();
                    $('#btn-request').hide();
                }
            });
            socket.on('setcurrentbet', (msg) => {
                if (msg.money != 0) {
                    isFirstRequest = false;
                    current_bet = msg.money;
                }
            });
            socket.on('stopauction', (msg) => {

            });
        });
    }


    function send() {
        if (socket) {
            socket.json.emit('msg', {name: $('#username').text(), value: $('#msg').val()});
        }
    }
});
var isFirstRequest = true;
var current_bet = 0;
var my_bet = 0;

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

function increaseBet() {
    $("input:radio:checked").val();
}
