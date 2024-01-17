const display = (() => {
  const rendermessage = (message) => {
    document.querySelector("#message").innerHTML = message;
  };
  return {
    rendermessage,
  };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  const render = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      boardHTML += `<div class='square' id=square-${index}'>${square}</div>`;
    });
    document.querySelector("#game").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  return {
    render,
    update,
    getGameboard,
  };
})();

const createplayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const Game = (() => {
  let players = [];
  let currentplayerindex = 0;
  let gameover = false;

  const start = () => {
    players = [
      createplayer(document.querySelector("#player1").value, "X"),
      createplayer(document.querySelector("#player2").value, "O"),
    ];
    currentplayerindex = 0;
    gameover = false;
    Gameboard.render();
  };

  const handleClick = (event) => {
    let index = parseInt(event.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;

    Gameboard.update(index, players[currentplayerindex].mark);
    if (
      checkforwin(Gameboard.getGameboard(), players[currentplayerindex].mark)
    ) {
      gameover = true;
      display.rendermessage(`${players[currentplayerindex].name} won!`);
    } else if (checkfortie(Gameboard.getGameboard())) {
      gameover = true;
      display.rendermessage(`its a tie!`);
    }

    currentplayerindex = currentplayerindex === 0 ? 1 : 0;
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    Gameboard.render();
    document.querySelector("#message").innerHTML = "";
  };

  return {
    start,
    restart,
    handleClick,
  };
})();

function checkforwin(board) {
  const winningcombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningcombinations.length; i++) {
    const [a, b, c] = winningcombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return true;
  }
  return false;
}

function checkfortie(board) {
  return board.every((cell) => cell !== "");
}

const restartbtn = document.querySelector("#restart-btn");
restartbtn.addEventListener("click", () => {
  Game.restart();
});

const startbtn = document.querySelector("#start-btn");
startbtn.addEventListener("click", () => {
  Game.start();
});
