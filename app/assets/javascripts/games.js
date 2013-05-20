var canvas = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'black', 'grey', 'brown', 'pink'],
    alreadySelected: [],

    clear: function() {
        this.game.clearRect(0, 0, this.width, this.height);
        // this.game.width = this.game.width;
    },

    draw_circle: function(x, y, r, c) {
        this.game.fillStyle = c;
        this.game.beginPath();
        this.game.arc(x, y, r, 0, Math.PI * 2, true);
        this.game.closePath();
        this.game.fill();
    },

    draw_game: function(gameMatrix) {
        this.clear();
        var col;
        var row;

        for (col = 0; col < gameMatrix.length; col++) {
            for (row = 0; row < gameMatrix[col].length; row++) {
                this.draw_circle(col.colToX(), row.rowToY(), this.circleR + 1, 'black');
                this.draw_circle(col.colToX(), row.rowToY(), this.circleR, this.colors[gameMatrix[col][row]]);
            }
        }
    },

    draw_frame: function(circle) {
        var x = circle.col.colToX() - this.circleR - 2 ;
        var y = circle.row.rowToY() - this.circleR - 2;
        this.game.beginPath();
        this.game.rect(x, y, this.cellSize, this.cellSize);
        this.game.closePath();
        this.game.stroke();
    },

    select_group: function(selected) {
        this.game.lineWidth = 2;

        this.game.strokeStyle = "white";
        for (var i = 0; i < this.alreadySelected.length; i++){
            this.draw_frame(this.alreadySelected[i]);
        }

        this.game.strokeStyle = "red";
        for (var i = 0; i < selected.length; i++){
            this.draw_frame(selected[i]);
        }

        this.alreadySelected = selected;
    }

};

var game = {
    matrix: [],
    selected: [],

    create: function(colCount, rowCount) {
        var col;
        var row;
        var colorRnd;
        for (col = 0; col < colCount; col++) {
            this.matrix[col] = [];
            for (row = 0; row < rowCount; row++){
                colorRnd = Math.floor(Math.random() * 5);
                this.matrix[col][row] = colorRnd;
            }
        }
            return this.matrix;
    },

    find_group: function(selecting) {
        var col = selecting.col;
        var row = selecting.row;
        var color = this.matrix[col][row];

        this.selected.pushIfGroupmate(this.matrix, col, row-1, color);
        this.selected.pushIfGroupmate(this.matrix, col+1, row, color);
        this.selected.pushIfGroupmate(this.matrix, col, row+1, color);
        this.selected.pushIfGroupmate(this.matrix, col-1, row, color);

        this.sel_index++;

        if (this.sel_index < this.selected.length){
          this.find_group(this.selected[this.sel_index]);
        }
    }

};

Array.prototype.notContains = function(col, row) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].col === col && this[i].row === row) {
            return false;
        }
    }
    return true;
};

Array.prototype.pushIfGroupmate = function(matrix, col, row, color) {
//verify that neighbor circle not nil, not already added to selected and have same color
    if (matrix[col] !== undefined && matrix[col][row] !== undefined && this.notContains(col, row) && matrix[col][row] === color){
            this.push({col: col, row: row});
    }
};

Number.prototype.colToX = function () {
    var col = parseInt(this);
    if (typeof col === "number") {
        return col * canvas.cellSize + canvas.circleR + canvas.border;
    } else {
        alert( 'colToX: You try to convert not number, but ' + typeof this );
    }
};

Number.prototype.rowToY = function () {
    var row = parseInt(this);
    if (typeof row === "number") {
        return row * canvas.cellSize + canvas.circleR + canvas.border;
    } else {
        alert( 'rowToY: You try to convert not number, but ' + this );
    }
};

Number.prototype.xToCol = function () {
    var x = parseInt(this);
    if (typeof x === "number") {
        return parseInt((x - canvas.border) / canvas.cellSize);
    } else {
        alert( 'xToCol: You try to convert not number, but ' + this );
    }
};

Number.prototype.yToRow = function () {
    var y = parseInt(this);
    if (typeof y === "number") {
        return parseInt((y - canvas.border) / canvas.cellSize);
    } else {
        alert( 'yToRow: You try to convert not number, but ' + this );
    }
};

$( document ).ready( function() {
    $canvas = $( '#canvas' );
    canvas.game = $canvas[0].getContext( "2d" );
    canvas.height = $canvas.height();
    canvas.width = $canvas.width();
    canvas.border = 4;
    canvas.circleR = 16;
    canvas.cellSize = canvas.circleR  * 2 + 4;
    canvas.colCont = ( canvas.width - canvas.width % canvas.cellSize ) / canvas.cellSize;
    canvas.rowCount = ( canvas.height - canvas.height % canvas.cellSize ) / canvas.cellSize;
    canvas.gameHeight = canvas.cellSize * canvas.rowCount + 2;
    canvas.gameWidth = canvas.cellSize * canvas.colCont + 2;

    var gameMatrix = game.create(canvas.colCont, canvas.rowCount);
    canvas.draw_game(gameMatrix);

    $canvas.on("click", function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        game.selected = [];
        game.selected.push({col: x.xToCol(), row: y.yToRow() });
        game.sel_index = 0;

        game.find_group(game.selected[0])
        canvas.select_group(game.selected);
    });
});