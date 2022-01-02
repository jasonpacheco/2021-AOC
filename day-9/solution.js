const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    const grid = [];
    data
      .toString()
      .split("\n")
      .forEach((row) => {
        grid.push([...row.split("").map((v) => +v)]);
      });
    return grid;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const isLowPoint = (board, rowIndex, cellIndex) => {
  const top = board[rowIndex - 1]?.[cellIndex] ?? Infinity;
  const left = board[rowIndex]?.[cellIndex - 1] ?? Infinity;
  const right = board[rowIndex]?.[cellIndex + 1] ?? Infinity;
  const bottom = board[rowIndex + 1]?.[cellIndex] ?? Infinity;
  const cellValue = board[rowIndex]?.[cellIndex];
  return cellValue < Math.min(top, left, bottom, right);
};

const findLowPoints = (input) => {
  const lowPoints = [];
  input.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (isLowPoint(input, rowIndex, cellIndex)) lowPoints.push(cell);
    });
  });
  return lowPoints;
};

const calculateRiskLevel = (input) => {
  return findLowPoints(input).reduce((acc, val) => acc + (val + 1), 0);
};

console.log(calculateRiskLevel(readSampleInput()));

const visitBasin = (board, point) => {
  const [row, col] = point;
  const cell = board[row]?.[col];
  if (cell === undefined || cell === 9 || cell === -1) return 0;
  board[row][col] = -1;
  return (
    1 +
    visitBasin(board, [row - 1, col]) +
    visitBasin(board, [row, col - 1]) +
    visitBasin(board, [row, col + 1]) +
    visitBasin(board, [row + 1, col])
  );
};

const countBasins = (input) => {
  const lowPoints = [];
  input.forEach((row, rowIndex) => {
    row.forEach((_, cellIndex) => {
      if (isLowPoint(input, rowIndex, cellIndex))
        lowPoints.push([rowIndex, cellIndex]);
    });
  });

  const basins = [];

  lowPoints.forEach((lowPoint) => {
    basins.push(visitBasin(input, lowPoint));
  });

  const sorted = basins.sort((a, b) => b - a);
  return sorted[0] * sorted[1] * sorted[2];
};

console.log(countBasins(readSampleInput()));
