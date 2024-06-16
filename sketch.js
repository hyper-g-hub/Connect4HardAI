let main_board = [[]];
let main_turn = "R";
let main_state = "ongoing";
let status = "";
let AI_side = "B";

function setup() {
  createCanvas(600, 600);
  main_board = create_new_board();
}

function draw() {
  background(220);
  textSize(25);
  text("Connect 4 Very Hard AI", 30, 50);
  textSize(20);
  text("By: Wonkanese", 30, 75);
  draw_board();
  draw_tiles(main_board);
  draw_status();
}

function draw_status() {
  let status_color;
  if (main_state == "ongoing") {
    if (main_turn == "R") {
      status = "Red's turn";
      status_color = color(255, 0, 0);
    } else {
      status = "Blue's turn";
      status_color = color(0, 0, 255);
    }
  } else {
    if (main_state == "R") {
      status = "Red Won";
      status_color = color(255, 0, 0);
    } else if (main_state == "tie") {
      status = "Tie";
      status_color = color(0, 0, 0);
    } else {
      status = "Blue Won";
      status_color = color(0, 0, 255);
    }
  }
  textSize(25);
  fill(status_color);
  text(status, 70, 500);
}

function create_new_board() {
  let new_board = [];
  for (let i = 0; i < 7; i++) {
    new_board.push(["", "", "", "", "", "", ""]);
  }
  return new_board;
}

function draw_board() {
  let start_y = height / 4;
  let sep = 30;
  let h = 300;
  textSize(25);
  strokeWeight(3);
  fill(0);
  for (let i = 1; i < 9; i++) {
    line(i * sep, start_y, i * sep, start_y + h);
    if (i != 8) {
      text(i, (i + 0.25) * sep, start_y);
    }
  }
  line(sep, start_y + h, sep * 8, start_y + h);
}

function draw_tiles(board) {
  let sep_x = 30;
  let sep_y = 42;
  let b = 430;
  strokeWeight(2);
  board.forEach((row, y) => {
    row.forEach((tile, x) => {
      let x_pos = (x + 1) * sep_x + 15;
      let y_pos = b - y * sep_y;
      let c;
      if (tile == "R") {
        c = color(255, 0, 0);
      } else {
        c = color(0, 0, 255);
      }
      fill(c);
      if (tile != "") {
        circle(x_pos, y_pos, 20);
      }
    });
  });
}

function drop_down(board, x) {
  for (let y = 0; y < 7; y++) {
    if (board[y][x] == "") {
      return y;
    }
  }
  return -1;
}

function main_place(slot) {
  let dropped = drop_down(main_board, slot - 1);
  if (dropped != -1) {
    main_board[dropped][slot - 1] = main_turn;
  }
  if (main_turn == "R") {
    main_turn = "B";
  } else {
    main_turn = "R";
  }
  main_state = game_state(main_board);
}

function available_moves(board) {
  let moves = [];
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 7; y++) {
      if (board[y][x] == "") {
        moves.push(x);
        break;
      }
    }
  }
  return moves;
}

function game_state(board) {
  for (let row of board) {
    let same = 0;
    let same_tile = "";
    for (let tile of row) {
      if (tile == "") {
        same = 0;
        same_tile = "";
      } else {
        if (tile == same_tile) {
          same += 1;
        } else if (same_tile != tile) {
          same_tile = tile;
          same = 1;
        }
        if (same == 4) {
          return same_tile;
        }
      }
    }
  }

  for (let x = 0; x < 7; x++) {
    let same = 0;
    let same_tile = "";
    for (let y = 0; y < 7; y++) {
      let tile = board[y][x];
      if (tile == "") {
        same = 0;
        same_tile = "";
      } else {
        if (tile == same_tile) {
          same += 1;
        } else if (same_tile != tile) {
          same_tile = tile;
          same = 1;
        }
        if (same == 4) {
          return same_tile;
        }
      }
    }
  }

  for (let row = 3; row < board.length; row++) {
    for (let col = 0; col < board[0].length - 3; col++) {
      let tile = board[row][col];
      if (
        tile != "" &&
        tile == board[row - 1][col + 1] &&
        tile == board[row - 2][col + 2] &&
        tile == board[row - 3][col + 3]
      ) {
        return tile;
      }
    }
  }

  for (let row = 0; row < board.length - 3; row++) {
    for (let col = 0; col < board[0].length - 3; col++) {
      let tile = board[row][col];
      if (
        tile != "" &&
        tile == board[row + 1][col + 1] &&
        tile == board[row + 2][col + 2] &&
        tile == board[row + 3][col + 3]
      ) {
        return tile;
      }
    }
  }

  for (let row of board) {
    for (let tile of row) {
      if (tile == "") {
        return "ongoing";
      }
    }
  }
  return "tie";
}

function keyPressed() {
  if (main_state != "ongoing") {
    return;
  }
  let nums = "1234567";
  if (nums.includes(key) && main_turn == "R") {
    let slot_to_move = parseInt(key) - 1;
    let moves = available_moves(main_board);
    if (moves.includes(slot_to_move)) {
      main_place(slot_to_move + 1);
      main_state = game_state(main_board);
      if (main_state == "ongoing") {
        main_place(ai_move() + 1);
      }
    }
  }
}

function random_vs_random() {
  main_state = game_state(main_board);
  if (main_state == "ongoing") {
    random_move();
    random_vs_random();
  }
}

function copy_board_place(board, slot, turn) {
  let new_board = [];
  for (let i = 0; i < board.length; i++) {
    new_board[i] = [];
    for (let j = 0; j < board[i].length; j++) {
      new_board[i][j] = board[i][j];
    }
  }
  let dropped = drop_down(board, slot);
  new_board[dropped][slot] = turn;
  return new_board;
}

function score(result) {
  if (result == "tie") {
    return 0;
  }
  if (result == "B") {
    return 1;
  }
  return -1;
}

function minimax(board, depth, maximizing) {
  console.log(depth);
  let result = game_state(board);
  if (result != "ongoing") {
    return score(result);
  }
  if (depth >= 5) {
    return 0;
  }
  if (maximizing) {
    let best_score = -Infinity;
    for (let move of available_moves(board)) {
      let new_board = copy_board_place(board, move, AI_side);
      let score = minimax(new_board, depth + 1, false);
      if (score > best_score) {
        best_score = score;
      }
    }
    return best_score;
  } else {
    let best_score = Infinity;
    for (let move of available_moves(board)) {
      let new_board = copy_board_place(board, move, "R");
      let score = minimax(new_board, depth + 1, true);
      if (score < best_score) {
        best_score = score;
      }
    }
    return best_score;
  }
}

function ai_move() {
  let best_score = -Infinity;
  let best_move = -1;
  let variation_moves = [];
  for (let move of available_moves(main_board)) {
    let new_board = copy_board_place(main_board, move, AI_side);
    let score = minimax(new_board, 0, false);
    if (score > best_score) {
      best_score = score;
      best_move = move;
      variation_moves = [];
      variation_moves.push(move);
    }
    else if (score == best_score) {
      variation_moves.push(move);
    }
  }
  return chooseRandomElement(variation_moves);
}

function chooseRandomElement(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
