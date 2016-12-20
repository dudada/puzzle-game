function GameBoard(wd, hi) {
    this.wide = wd - 1;
    this.high = hi - 1;
    this.count= 0;
    this.renderBoard = function() {
        var s = "";
        for (var j = 0; j <= this.high; j++) {
            s += "<div class='gamerow'>";
            for (var i = 0; i <= this.wide; i++) {
                s += "<div class='gamesquare coord" + i + "q" + j + "'></div>";
            }
            s += "</div>";
        }
        $('.board').html(s);

        for (var i = 0; i <= this.wide; i++) {
            for (var j = 0; j <= this.high; j++) {
                this.squareView(i, j);
            }
        }
    };

    this.board = new Array(wd);
    for (var i = 0; i <= this.wide; i++) {
        this.board[i] = new Array(hi);
    }

    this.squareView = function(w, h) {
        var coord = ".coord" + w + "q" + h;
        if (this.board[w][h] == 0) {
            $(coord).css("background-color", "#E6AB5E");
        } else {
            $(coord).css("background-color", "#5C90FF");
        }
    };

    this.getFixedXY = function(x, y) {
        var lowx = x - 1;
        var highx = x + 1;
        var lowy = y - 1;
        var highy = y + 1;


        if (x == 0) lowx = 0;
        if (x == this.wide) highx = this.wide;
        if (y == 0) lowy = 0;
        if (y == this.high) highy = this.high;
        return {
            lowx: lowx,
            highx: highx,
            lowy: lowy,
            highy: highy
        };
    };

    this.squareClick = function(w, h) {
        var __ret = this.getFixedXY(w, h);
        var lowx = __ret.lowx;
        var highx = __ret.highx;
        var lowy = __ret.lowy;
        var highy = __ret.highy;

        for (var i = lowy; i <= highy; i++) {
            if (this.board[w][i] == 0) {
                this.board[w][i] = 1;
                this.count++;
            } else {
                this.board[w][i] = 0;
                this.count--;
            }
            this.squareView(w, i);
        }


        for (var i = lowx; i <= highx; i++) {
            if (i == w) continue;
            if (this.board[i][h] == 0) {
                this.board[i][h] = 1;
                this.count++;
            } else {
                this.board[i][h] = 0;
                this.count--;
            }
            this.squareView(i, h);
        }
    };

    this.populate = function() {
        for (var i = 0; i <= this.wide; i++) {
            for (var j = 0; j <= this.high; j++) {
                this.board[i][j] = 0;
            }
        }
    };

    this.isGameWin=function(){
        return this.count == (this.wide + 1) * (this.high + 1);
    };
}

function Game() {
    var self = this;
    var level = 1;
    this.sh = new StyleHelper();

    this.setupLevel = function() {
        this.gb = new GameBoard(level, level);
        this.gb.populate();
        this.gb.renderBoard();
        this.sh.setGridSize(level);
        self.applyBindings();
    };

    this.beginGame = function() {
        this.setupLevel();
    };

    this.getCorrd = function(content) {
        var cname = content.className.split(" ")[1];
        var coord = cname.substring(5).split("q");
        var height = parseInt(coord[1]);
        var width = parseInt(coord[0]);
        return {
            x: width,
            y: height
        };
    };

    this.applyBindings = function() {
        $('.gamesquare').click(function() {
            var corrd = self.getCorrd(this);
            self.gb.squareClick(corrd.x, corrd.y);
            if(self.gb.isGameWin()){
                level++;
                setTimeout(function () {
                    self.setupLevel();
                }, 500);
            }
        });
    };
}

function StyleHelper() {
    this.setGridSize = function(level) {
        var margin = this.getMargin(level);
        var res = ($('.container').width() - margin * level) / (level);
        $('.gamesquare').css('margin-right', margin);
        $('.gamesquare').css('width', res);
        $('.gamesquare').css('height', res);
        $('.gamerow').css('height', res);
        $('.gamerow').css('margin-right', margin * (-1));
        $('.gamerow').css('margin-bottom', margin);
        $('.board').css('padding', margin);
        $('.board').css('padding-bottom', 0);
    };

    this.getMargin = function(level) {
        if (level <= 6) return 15;
        if (level > 15) return 5;
        return 20 - level;
    };
}