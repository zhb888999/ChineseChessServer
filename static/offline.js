let chess = new Chess();
chess.init();
let positions = document.getElementsByClassName("position");
for(let i=0; i < positions.length; i++) {
    positions[i].onclick = function(e) {
        let position = parseInt(this.id.substr(1));
        chess.run(position)
    }
}