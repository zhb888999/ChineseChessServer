let chess = new Chess();
let start = false;
let redblack = 'b';
let state = 0;
let playerQuit = false;
let gameover = false;

let message1 = document.getElementById("message1");
if(message1) message1.innerHTML = '执黑棋';

function getStart() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/start");
    xhr.send();
    xhr.onreadystatechange = function() {
        let message3 = document.getElementById("message3");
        if(xhr.readyState==4) {
            if(xhr.status==200) {
                start = true; 
                state = 1;
                if(message3) message3.innerHTML = '';
            } else {
                if(message3) message3.innerHTML = '正在匹配...';
            }
        } 
    }
}

function getMessage () {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/getmessage");
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4) {
            if(xhr.status==200) {
                let res = JSON.parse(xhr.responseText);
                if(res['play_exit'] == 1) {
                    playerQuit = true;
                    state = 5;
                    return;
                }
                if(res['play_message'] == 1) {
                    if(res['message'] != -1) {
                        chess.run(parseInt(res['message']));
                        if(chess.currentRedBlack == redblack) {
                            state = 2;
                        }
                        if(chess.gameover) {
                            gameover = true;
                            state = 4;
                        }
                    }
                }
            } 
        } 
    }
}

function addMessage(position) {
    if(state != 2) return;
    chess.run(position);
    if (chess.gameover) gameover=true;
    let xhr = new XMLHttpRequest();
    let form = new FormData()
    form.append("gameover", gameover);
    form.append("message", position);
    xhr.open("POST", "/addmessage");
    xhr.send(form);
    if (chess.currentRedBlack != redblack) state = 3;
}

function init() {
    chess.init();
    let positions = document.getElementsByClassName("position");
    for(let i=0; i < positions.length; i++) {
        positions[i].onclick = function(e) {
            addMessage(parseInt(this.id.substr(1)));
        }
    }
    state =  redblack == chess.currentRedBlack ? 2 : 3;
}

function run() {
    console.log(state)
    switch(state) {
        case 0:
            getStart();
            break;
        case 1:
            init();
            break;
        case 3:
            getMessage();
            break;
        default:
            break;
    }
}

window.setInterval(run, 500);