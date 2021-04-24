let Chessman = function(name, initialPosition, redblack, ctype) {
    this.name = name;
    this.element = document.getElementById(name);
    this.redblack = redblack;
    this.initialPosition = initialPosition;
    this.position = initialPosition;
    this.select = false;
    this.alive = true;
    this.ctype = ctype;

    this.setPosition = function(position, zIndex=2) {
        this.position = position;
        this.unsetSelect();
        this.element.style.transform = this.getTransform();
        this.setZIndex(zIndex);
    };

    this.setZIndex = function(zIndex=0) {
        this.element.style.zIndex = zIndex;
    };

    this.setSelect = function() {
        let classNames = this.element.className.split();
        classNames.push("select");
        this.element.className = classNames.join(" ");
        this.select = true;
    };

    this.unsetSelect = function() {
        let classNames = this.element.className.split(" ");
        let index = classNames.indexOf("select");
        if (index > -1) {
            classNames.splice(index, 1);
            this.element.className = classNames.join(" ");
            this.select = false;
        }
    };

    this.getTransform = function() { 
        let start = this.getTwoDimPosition(this.initialPosition);
        let end =  this.getTwoDimPosition(this.position);
        let leftpx = (end[0]-start[0])*10;
        let toppx = (end[1]-start[1])*10;
        return `translate(${toppx}vw, ${leftpx}vw)`;
    };

    this.getTwoDimPosition = function(position) {
        return  [parseInt(position/9) + 1, position%9 + 1]; 
    };

    this.setAlive = function(state) {
        if (this.alive === state) {
            return;
        }
        this.alive = state;
        let value = this.alive ? "visible" : "hidden";
        this.element.style.visibility = value;
    }

    this.delete = function() {
        this.alive = false;
        this.element.style.display = "none";
    }
}

let Chess = function() {
    this.chessboard = Array(90);
    this.zIndex = 0;
    this.currentRedBlack = 'r';
    this.currentChessman = null;
    this.gameover = false;
    this.history = [];
    this.step = 0;
    this.chessmans =  {
      'rj1': new Chessman('rj1', 0, 'r', 'j'),
      'rm1':  new Chessman('rm1', 1, 'r', 'm'),
      'rx1':  new Chessman('rx1', 2, 'r', 'x'),
      'rs1':  new Chessman('rs1', 3, 'r', 's'),
      'rl1':  new Chessman('rl1', 4, 'r', 'l'),
      'rs2':  new Chessman('rs2', 5, 'r', 's'),
      'rx2':  new Chessman('rx2', 6, 'r', 'x'),
      'rm2':  new Chessman('rm2', 7, 'r', 'm'),
      'rj2':  new Chessman('rj2', 8, 'r', 'j'),
      'rp1':  new Chessman('rp1', 19, 'r', 'p'),
      'rp2':  new Chessman('rp2', 25, 'r', 'p'),
      'rb1':  new Chessman('rb1', 27, 'r', 'b'),
      'rb2':  new Chessman('rb2', 29, 'r', 'b'),
      'rb3':  new Chessman('rb3', 31, 'r', 'b'),
      'rb4':  new Chessman('rb4', 33, 'r', 'b'),
      'rb5':  new Chessman('rb5', 35, 'r', 'b'),
      'bb1':  new Chessman('bb1', 54, 'b', 'b'),
      'bb2':  new Chessman('bb2', 56, 'b', 'b'),
      'bb3':  new Chessman('bb3', 58, 'b', 'b'),
      'bb4':  new Chessman('bb4', 60, 'b', 'b'),
      'bb5':  new Chessman('bb5', 62, 'b', 'b'),
      'bp1':  new Chessman('bp1', 64, 'b', 'p'),
      'bp2':  new Chessman('bp2', 70, 'b', 'p'),
      'bj1':  new Chessman('bj1', 81, 'b', 'j'),
      'bm1':  new Chessman('bm1', 82, 'b', 'm'),
      'bx1':  new Chessman('bx1', 83, 'b', 'x'),
      'bs1':  new Chessman('bs1', 84, 'b', 's'),
      'bl1':  new Chessman('bl1', 85, 'b', 'l'),
      'bs2':  new Chessman('bs2', 86, 'b', 's'),
      'bx2':  new Chessman('bx2', 87, 'b', 'x'),
      'bm2':  new Chessman('bm2', 88, 'b', 'm'),
      'bj2':  new Chessman('bj2', 89, 'b', 'j')
    };

    this.appendChessman = function(chessman) {
        this.chessboard[chessman.initialPosition] = chessman;
    }

    this.deleteChessman = function(chessman) {
        chessman.delete();
    }

    this.init = function() {
        for (let key in this.chessmans) {
            this.appendChessman(this.chessmans[key]);
        }
        this.saveCurrentChessboard();
    }

    this.saveCurrentChessboard = function() {
        let chessboard = [];
        for (let i=0; i<this.chessboard.length; i++) {
            if(this.chessboard[i]) {
                chessboard.push(this.chessboard[i].name);
            } else {
                chessboard.push("");
            }
        }
        if(this.step < this.history.length) {
            this.history.splice(this.step, this.history.length - this.step);
        }
        this.step++;
        this.history.push(chessboard.join(","));
    }

    this.withdraw = function() {
        this.recoverChessbord(this.step-1);
    }
    
    this.forward = function() {
        this.recoverChessbord(this.step+1);
    }

    this.recoverChessbord = function(step) {
        if(step < 1) return; 
        if(step > this.history.length) return;
        let chessboard = this.history[step - 1].split(',');
        for(let i=0; i<chessboard.length; i++) {
            if(chessboard[i]) {
                let chess = this.chessmans[chessboard[i]];
                this.chessboard[i] = chess;
                chess.setPosition(i);
                chess.setAlive(true);
                chess.unsetSelect();
            } else {
                this.chessboard[i] = null;
            }
        }
        let gameover;
        for(let key in this.chessmans) {
            if(chessboard.indexOf(key) == -1) {
                if(this.chessmans[key].ctype == 'l') {
                    gameover = true;
                }
                this.chessmans[key].setAlive(false);
                this.chessmans[key].unsetSelect();
            } 
        }
        this.currentChessman = null;
        this.currentRedBlack = step%2==1 ? 'r' : 'b';
        if(gameover) {
            this.gameover = true;
            this.changeCurrenReadBlack();
        } else {
            this.gameover = false;
        }
        this.step = step;
    }

    this.setCurrentChessman = function(chessman) {
        for (let key in this.chessmans) {
            if(this.chessmans[key].alive) this.chessmans[key].setZIndex();
        }
        if (this.currentChessman == null) {
            if(chessman.redblack == this.currentRedBlack) {
                this.currentChessman = chessman;
                chessman.setSelect();
            }
            return;
        }
        if (this.currentChessman == chessman) {
            this.currentChessman.unsetSelect();
            this.currentChessman = null;
            return;
        } 
        if (this.currentChessman != chessman) {
            if(chessman.redblack == this.currentRedBlack) {
                this.currentChessman.unsetSelect();
                this.currentChessman = chessman;
                this.currentChessman.setSelect();
            }
        }
    }

    this.unsetCurrentChessman = function() {
        if(this.currentChessman) {
            this.currentChessman.unsetSelect();
            this.currentChessman = null;
        }
    }

    this.moveChessman = function(position) {
        if (this.currentChessman) {
            let moveIndex = this.currentChessman.position;
            if(!this.checkMove(position)) {
                console.log("can't move!");
                return;
            };
            for(let key in this.chessmans) {
                if(this.chessmans[key] != this.currentChessman) {
                    if(this.chessmans[key].alive) {
                        this.chessmans[key].setZIndex();
                    }
                }
            }
            this.currentChessman.setPosition(position);
            let killed = this.chessboard[position]
            this.chessboard[position] = this.chessboard[moveIndex]
            this.chessboard[moveIndex] = null;
            this.saveCurrentChessboard();
            if(killed) {
                killed.setAlive(false);
                if(killed.ctype == 'l') {
                    this.gameover = true;
                    let message2 = document.getElementById("message2");
                    let win =  this.currentRedBlack=='r' ? '红' : '黑';
                    if(message2) message2.innerHTML = `${win}方胜！`;
                    return;
                }
            }
            this.unsetCurrentChessman();
            this.changeCurrenReadBlack();
        }
    }

    this.changeCurrenReadBlack = function() {
        this.currentRedBlack = this.currentRedBlack=='b' ? 'r' : 'b';
        let mess = this.currentRedBlack=='r' ? '红' : '黑';
        document.getElementById("message2").innerHTML =`${mess}方走棋`;
    }

    this.run = function(position) {
        if(position < 0 || position > 89) return;
        if(this.gameover) {
            console.log(`${this.currentRedBlack} win!`);
            return;
        }
        let chessman = this.chessboard[position];
        if (chessman) {
            if (chessman.redblack == this.currentRedBlack) {
                this.setCurrentChessman(chessman);
                return;
            }
            this.moveChessman(position);
            return;
        }
        this.moveChessman(position);
    }

    this.checkMove = function(dstPosition) {
        let srcPosition = this.currentChessman.position;
        let srcRedBlack = this.currentRedBlack;
        switch (this.currentChessman.ctype) {
            case 'j':
                return this.checkMoveJ(srcPosition, dstPosition, srcRedBlack); 
            case 'm':
                return this.checkMoveM(srcPosition, dstPosition, srcRedBlack); 
            case 'x':
                return this.checkMoveX(srcPosition, dstPosition, srcRedBlack); 
            case 's':
                return this.checkMoveS(srcPosition, dstPosition, srcRedBlack); 
            case 'l':
                return this.checkMoveL(srcPosition, dstPosition, srcRedBlack); 
            case 'p':
                return this.checkMoveP(srcPosition, dstPosition, srcRedBlack); 
            case 'b':
                return this.checkMoveB(srcPosition, dstPosition, srcRedBlack); 
            default:
                return true;
        }
    }

    this.checkMoveB = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
        let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
        if((Math.abs(srcTwoDimPosition[0] - dstTwoDimPosition[0]) + Math.abs(srcTwoDimPosition[1] - dstTwoDimPosition[1])) != 1) return false;
        if(srcRedBlack=='r') {
            if(dstTwoDimPosition[0] < srcTwoDimPosition[0]) return false;
            if((dstTwoDimPosition[0] - srcTwoDimPosition[0]) != 1 && dstPosition < 45) return false;
            return true;
        }
        if(srcRedBlack=='b') {
            if(srcTwoDimPosition[0] < dstTwoDimPosition[0]) return false;
            if((srcTwoDimPosition[0] - dstTwoDimPosition[0]) != 1 && dstPosition > 44) return false;
            return true;
        }
        return false;
    }

    this.checkMoveP = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let [max, min] = srcPosition > dstPosition ? [srcPosition, dstPosition] : [dstPosition, srcPosition];
        let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
        let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
        let dst = this.chessboard[dstPosition];
        let step;
        if(srcTwoDimPosition[0] == dstTwoDimPosition[0]) step = 1;
        if(srcTwoDimPosition[1] == dstTwoDimPosition[1]) step = 9;
        if(step) {
            let middle = 0;
            while(true) {
                min += step;
                if(min >= max) break;
                if(this.chessboard[min]) middle++;
            }
            if(middle==0 && !dst) return true;
            if(dst && dst.redblack!=srcRedBlack && middle==1) return true;
        }
        return false;
    }

    this.checkMoveL = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let limits = [];
        let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
        let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
        let dst = this.chessboard[dstPosition];
        if(dst && dst.ctype=='l') {
            if(srcTwoDimPosition[1] == dstTwoDimPosition[1]) {
                let [max, min] = srcPosition > dstPosition ? [srcPosition, dstPosition] : [dstPosition, srcPosition];
                while(true) {
                    min += 9;
                    if(min >= max) break;
                    if(this.chessboard[min]) return false;
                }
                return true;
            }
        }
        if((Math.abs(srcTwoDimPosition[0] - dstTwoDimPosition[0]) + Math.abs(srcTwoDimPosition[1] - dstTwoDimPosition[1])) != 1) return false;
        if(srcRedBlack == 'r') limits = [3, 4, 5, 3+9, 4+9, 5+9, 3+18, 4+18, 5+18];
        if(srcRedBlack == 'b') limits = [66, 67, 68, 66+9, 67+9, 68+9, 66+18, 67+18, 68+18];
        if(limits.indexOf(dstPosition) > -1) return true;
        return false;
    }

    this.checkMoveS = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let limits = []
        let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
        let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
        if(Math.abs(srcTwoDimPosition[0] - dstTwoDimPosition[0]) != 1 || Math.abs(srcTwoDimPosition[1] - dstTwoDimPosition[1]) != 1) return false;
        if(srcRedBlack == 'r') limits = [3, 5, 13, 21, 23];
        if(srcRedBlack == 'b') limits = [84, 86, 76, 66, 68];
        if(limits.indexOf(dstPosition) > -1) return true;
        return false;
    }

    this.checkMoveX = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
        let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
        if(srcRedBlack == 'r' && dstPosition > 44) return false; 
        if(srcRedBlack == 'b' && dstPosition < 45) return false; 
        if(Math.abs(srcTwoDimPosition[0] - dstTwoDimPosition[0]) != 2 || Math.abs(srcTwoDimPosition[1] - dstTwoDimPosition[1]) != 2) return false;
        let x = Math.min(srcTwoDimPosition[0], dstTwoDimPosition[0]) + 1;
        let y = Math.min(srcTwoDimPosition[1], dstTwoDimPosition[1]) + 1;
        if(this.chessboard[this.getOneDimPosition(x, y)]) return false;
        return true;
    }

    this.checkMoveJ = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let [max, min] = srcPosition > dstPosition ? [srcPosition, dstPosition] : [dstPosition, srcPosition];
        let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
        let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
        let step;
        if(srcTwoDimPosition[0] == dstTwoDimPosition[0]) step=1;
        if(srcTwoDimPosition[1] == dstTwoDimPosition[1]) step=9;
        if(step) {
            while(true) {
                min += step;
                if(min >= max) break;
                if(this.chessboard[min]) return false;
            }
            return true;
        }
        return false;
    }

    this.checkMoveM = function(srcPosition, dstPosition, srcRedBlack) {
        if(this.chessboard[dstPosition] && this.chessboard[dstPosition].redblack == srcRedBlack) return false;
        let subs = [19, 17, 11, 7];
        let sub = Math.abs(srcPosition - dstPosition);
        if(subs.indexOf(sub) > -1) {
            let srcTwoDimPosition = this.getTwoDimPosition(srcPosition);
            let dstTwoDimPosition = this.getTwoDimPosition(dstPosition);
            let x, y;
            if(Math.abs(srcTwoDimPosition[0] - dstTwoDimPosition[0]) == 1) {
                x = srcTwoDimPosition[0];
                y = srcTwoDimPosition[1] < dstTwoDimPosition[1] ? srcTwoDimPosition[1] + 1 : srcTwoDimPosition[1] - 1;
            } else {
                y = srcTwoDimPosition[1];
                x = srcTwoDimPosition[0] < dstTwoDimPosition[0] ? srcTwoDimPosition[0] + 1 : srcTwoDimPosition[0] - 1;
            }
            if(this.chessboard[this.getOneDimPosition(x, y)]) {
                return false;
            } 
            return true;
        }
        return false;
    }

    this.getTwoDimPosition = function(position) {
        return  [parseInt(position/9) + 1, position%9 + 1]; 
    }

    this.getOneDimPosition = function(x, y) {
        return  (x - 1)*9 + (y - 1); 
    }
};

function scaleChessboard() {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let scale = 1;
    if (width > height) {
        scale  = height/width; 
        let show = document.getElementById("show")
        show.style.transform = `scale(${scale},${scale})`;
    }
}
scaleChessboard();