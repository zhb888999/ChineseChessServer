let chess=new Chess();
chess.init()
let history = [];
document.getElementById("message1").innerHTML = "观战中";

function getHouseHistory() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/gethouserhistory");
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4) {
            if(xhr.status==200) {
                if(xhr.responseText == "{}") return
                let res = JSON.parse(xhr.responseText);
                let gameover = res['gameover'];
                let play_exit = res['play_exit'];
                let new_history = res['history'];
                if(new_history.length == history.length) return
                console.log(new_history);
                let positions = new_history.slice(history.length, new_history.length)
                for(let i=0; i<positions.length; i++) {
                    chess.run(parseInt(positions[i])); 
                }
                history = new_history;
                if(play_exit==1) {
                    document.getElementById("message3").innerHTML = "玩家退出游戏！";
                }
            } 
        } 
    }
}

window.setInterval(getHouseHistory, 500);