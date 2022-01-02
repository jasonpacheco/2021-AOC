const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    const raw = data.toString().split("\n");

    const [rawBingoNumbers, ...rawBoards] = raw;
    const boards = [];
    let temp = [];
    rawBoards.forEach((line, index) => {
      if (line === "") {
        if (index > 0) {
          boards.push(temp);
        }
        temp = [];
      } else {
        temp.push(line.split(" ").filter((v) => v));
      }
    });
    boards.push(temp);

    return {
      bingo: rawBingoNumbers.split(","),
      boards: boards,
    };
  } catch (error) {
    console.log(error);
    return {
      bingo: [],
      boards: [],
    };
  }
};

const getColumn = (board, col) => {
  const column = [];
  board.forEach((row) => {
    column.push(row[col]);
  });
  return column;
};

const checkForBingo = (board) => {
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    if (row.every((v) => v.startsWith("+"))) return true;
    if (getColumn(board, i).every((v) => v.startsWith("+"))) return true;
  }

  return false;
};

const markAllBoards = (boards, numberToMark, remainingBoardsIndices) => {
  let winner = null;
  for (let i = 0; i < boards.length; i++) {
    if (!remainingBoardsIndices.includes(i)) continue;
    let row = -1;
    let col = -1;
    const board = boards[i];
    for (let boardRow = 0; boardRow < board.length; boardRow++) {
      const currentRow = board[boardRow];
      const columnToMark = currentRow.findIndex((v) => v === numberToMark);
      if (columnToMark > -1) {
        row = boardRow;
        col = columnToMark;
        break;
      }
    }

    if (row > -1 && col > -1) {
      boards[i][row][col] = `+${boards[i][row][col]}`;
    }

    const isBingo = checkForBingo(boards[i]);
    if (isBingo) {
      winner = boards[i];
      const indexToRemove = remainingBoardsIndices.findIndex((v) => v === i);
      remainingBoardsIndices.splice(indexToRemove, 1);
    }
  }

  return winner;
};

const getUnmarkedNumbersSum = (winningBoard) => {
  let unmarkedNumbers = [];
  winningBoard.forEach((row) => {
    row.forEach((num) => {
      if (!num.startsWith("+")) {
        unmarkedNumbers.push(Number(num));
      }
    });
  });
  return unmarkedNumbers.reduce((acc, curr) => acc + curr, 0);
};

const getWinningBoardScore = ({ bingo, boards }, params = { part: 1 }) => {
  let lastCalledNumber = 0;
  let winner = null;
  const remainingBoardsIndices = boards.map((curr, index) => index);
  for (let i = 0; i < bingo.length; i++) {
    lastCalledNumber = bingo[i];
    winner = markAllBoards(boards, lastCalledNumber, remainingBoardsIndices);
    if (params.part === 2) {
      if (remainingBoardsIndices.length === 0) break;
    } else {
      if (winner) break;
    }
  }

  return Number(lastCalledNumber) * getUnmarkedNumbersSum(winner);
};

console.log(getWinningBoardScore(readSampleInput(), { part: 1 }));
console.log(getWinningBoardScore(readSampleInput(), { part: 2 }));
