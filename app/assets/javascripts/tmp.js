
      var game;
      var width = $("#canvas").width();
      var height = $("#canvas").height();
      var circle_r = 16;
      var cell_size = circle_r *2 + 4;
      var border = circle_r + 4;
      var col_count = (width - width%cell_size)/cell_size;
      var row_count = (height - height%cell_size)/cell_size;
      var game_width = cell_size * col_count + 2;
      var game_height = cell_size * row_count + 2;
      var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'black', 'grey', 'brown', 'pink'];
      var matrix = new Array(col_count);
      var selected = [];
      var sel_index = 0;

      function init() {
        game = $('#canvas')[0].getContext("2d");
        generate_game();
      }

      function clear() {
        game.clearRect(0, 0, width, height);
      }

       function clear_circle(col,row) {
        var rect = circle_r + 3;
        var circle = get_circle(col, row);
        game.clearRect(circle[0] - rect, circle[1] - rect, cell_size, cell_size);
      }

      function clear_undefined(){
         for (var col in matrix){
                matrix[col] = matrix[col].filter(Boolean);
          }
      }

      function clear_removed(remove){
            for (var col in remove){
                var from = remove[col][1];
                var count = remove[col][0];
                if (count > 0 ){
                      for (var row = from; row < matrix[col].length; row++){
                            var x = col * cell_size + border;
                            var y = height - row * cell_size - border;
                            var color = matrix[col][row][2];
                            matrix[col][row] = [x,y,color];
                      }
                }
            }
      }

      function circle(col,row) {
        var rnd=Math.floor(Math.random()*5);
        matrix[col][row] = new Array(3);
        matrix[col][row][0] = col * cell_size + border;
        matrix[col][row][1] = height - row * cell_size - border;
        matrix[col][row][2] = rnd;
      }

      function generate_game(){
          for (var col = 0; col < col_count ; col++){
              matrix[col] = new Array(row_count);
              for (var row = 0; row < row_count ; row++ ){
                    circle(col, row);
              }
            }
          fill_canvas();
      }

      function draw_circle(x,y,r,c){
        game.fillStyle = c;
        game.beginPath();
        game.arc(x, y, r, 0, Math.PI*2, true);
        game.closePath();
        game.fill();
      }

     function fill_canvas() {
            clear();

            for (var col in matrix){
                for (var row in matrix[col]){
                  draw_circle(matrix[col][row][0], matrix[col][row][1], circle_r + 1, 'black');
                  draw_circle(matrix[col][row][0], matrix[col][row][1], circle_r, colors[matrix[col][row][2]]);
                }
            }
      }

      function select_circles(selected, color) {
        var rect = circle_r + 2;
        game.lineWidth = 2;
        game.strokeStyle = color;
        for (var s in selected){
              var circle = get_circle(selected[s][0], selected[s][1]);
              var x = circle[0] - rect;
              var y = circle[1] - rect;
              game.beginPath();
              game.rect(x, y, cell_size, cell_size);
              game.closePath();
              game.stroke();
        }
      }

      function get_circle(col,row){
        return matrix[col][row];
      }

      function get_circle_index(x,y){
          var col =  (x - x%cell_size)/cell_size;
          y = height - y;
          var row =  (y - y%cell_size)/cell_size;
          return [col, row];
      }



      function is_contains_array(arr, matr){
        for (var ar in matr){
            if (JSON.stringify(matr[ar])===JSON.stringify(arr))
              return true;
        }
          return false;
      }



      function is_same_color(n_col, n_row, color){
        if (matrix[n_col] == undefined){
          return undefined;
        }
        else{
          var neighbor =  get_circle(n_col, n_row);
          var circle = [n_col, n_row];
        }

          //verify that neighbor circle not nil, not already added to selected and have same color
          if (neighbor == undefined){
            return undefined;
          }

          if (is_contains_array(circle, selected)){
            return undefined;
          }

          if (neighbor[2] != color){
            return undefined;
          }
          else{
            return circle;
          }
      }

      function find_neighbors(circle_index){
          var col = circle_index[0];
          var row = circle_index[1];
          var circle = get_circle(col, row);

          selected.push(is_same_color(col, row-1, circle[2]));
          selected.push(is_same_color(col+1, row, circle[2]));
          selected.push(is_same_color(col, row+1, circle[2]));
          selected.push(is_same_color(col-1, row, circle[2]));
          selected = selected.filter(Boolean);

          sel_index++;

          if (sel_index < selected.length){
            find_neighbors(selected[sel_index]);
          }
      }

      function add_circles(){
          for (var col in matrix){
              var short_col = matrix[col].length;

              if(short_col != row_count){
                  for (var row = short_col; row < row_count; row++ ){
                      circle(col, row);
                  }
              }
          }
      }

      function update_matrix(){
          var remove = [];
          for (var i = 0; i < col_count; i++){
              remove[i] = [0,row_count];
          }

          for (var sel in selected){
              var col = selected[sel][0];
              var row = selected[sel][1];
              matrix[col][row] = undefined;
              remove[col][0]++;
              if (row < remove[col][1]){
                  remove[col][1] = row;
              }
          }
          clear_undefined();
          clear_removed(remove);
          add_circles();
      }

      function sleep(milliseconds) {
          var start = new Date().getTime();
          for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
              break;
            }
          }
        }

      function game_logic(x, y){
              var circle_index = get_circle_index(x,y);

              select_circles(selected, 'white');//TODO: rewrite ass clear circle

              if (is_contains_array(circle_index, selected)){
                    for (var s  in selected){
                        clear_circle(selected[s][0], selected[s][1]);
                    }
                    update_matrix();
                    fill_canvas();
                }
                else{
                  selected = [];
                  sel_index = 0;
                  selected[sel_index] = circle_index;
                  find_neighbors(circle_index);
                  select_circles(selected, 'red');
                }
      }

      //Main:

      init();

      $("#canvas").on('click', function(e){
          var x = e.pageX - this.offsetLeft;
          var y = e.pageY - this.offsetTop;
          if (x < game_width && y > (height - game_height)){
              game_logic(x,y);
          }
      });
