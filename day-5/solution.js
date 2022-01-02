const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    const raw = data.toString().split("\n");
    const output = [];
    raw.forEach((line) => {
      const [p1, p2] = line.split("->");
      output.push([
        p1
          .trim()
          .split(",")
          .map((v) => +v),
        p2
          .trim()
          .split(",")
          .map((v) => +v),
      ]);
    });

    return output;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const normalize = (input) => {
  let largestX = -Infinity;
  let largestY = -Infinity;
  input.forEach(([[x1, y1], [x2, y2]]) => {
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    if (maxX > largestX) {
      largestX = maxX;
    }
    if (maxY > largestY) {
      largestY = maxY;
    }
  });

  return Array.from({ length: largestY + 1 }).map((row) =>
    Array.from({ length: largestX + 1 }).fill(0)
  );
};

const lineTest = (p1, p2) => {
  const [[x1, y1], [x2, y2]] = [p1, p2];
  const dx = x2 - x1;
  if (dx === 0) return "vertical";
  const dy = y2 - y1;
  if (dy === 0) return "horizontal";
  return "diagonal";
};

const plotVerticalSegment = (grid, p1, p2) => {
  const [[x, y1], [, y2]] = [p1, p2];
  const [minY, maxY] = y2 > y1 ? [y1, y2] : [y2, y1];
  for (let i = minY; i <= maxY; i++) {
    grid[i][x] += 1;
  }
};

const plotHorizontalSegment = (grid, p1, p2) => {
  const [[x1, y], [x2]] = [p1, p2];
  const [minX, maxX] = x2 > x1 ? [x1, x2] : [x2, x1];
  for (let i = minX; i <= maxX; i++) {
    grid[y][i] += 1;
  }
};

const plotDiagonalSegment = (grid, p1, p2) => {
  const [[x1, y1], [x2, y2]] = [p1, p2];
  const [minY, maxY] = y2 > y1 ? [y1, y2] : [y2, y1];
  const m = (y2 - y1) / (x2 - x1);

  for (let y = minY; y <= maxY; y++) {
    const x = (y - y1) / m + x1;
    grid[y][x] += 1;
  }
};

const countOverlap = (plotted) => {
  return plotted.reduce((acc, curr) => {
    curr.forEach((line) => {
      if (line > 1) {
        acc += 1;
      }
    });
    return acc;
  }, 0);
};

const plotAndCount = (input, params = { part: 1 }) => {
  const grid = normalize(input);
  input.forEach(([p1, p2]) => {
    const type = lineTest(p1, p2);
    if (type === "horizontal") plotHorizontalSegment(grid, p1, p2);
    if (type === "vertical") plotVerticalSegment(grid, p1, p2);
    if (params.part === 2 && type === "diagonal")
      plotDiagonalSegment(grid, p1, p2);
  });

  // return grid.map((r) => r.map((v) => v || ".").join("")).join("\n");
  return countOverlap(grid);
};

console.log(plotAndCount(readSampleInput(), { part: 1 }));
console.log(plotAndCount(readSampleInput(), { part: 2 }));
