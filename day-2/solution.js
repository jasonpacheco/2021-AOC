const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    return data
      .toString()
      .split("\n")
      .map((line) => {
        const [direction, unit] = line.split(" ");
        return [direction, Number(unit)];
      });
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sample = [
  ["forward", 5],
  ["down", 5],
  ["forward", 8],
  ["up", 3],
  ["down", 8],
  ["forward", 2],
];

const calculateDepth = (input, params = { withAim: false }) => {
  const finalPosition = input.reduce(
    (acc, curr) => {
      const [direction, units] = curr;

      return {
        aim: params.withAim
          ? direction === "up" || direction === "down"
            ? acc.aim + (direction === "up" ? units * -1 : units)
            : acc.aim
          : acc.aim,
        horizontal:
          direction === "forward" ? acc.horizontal + units : acc.horizontal,
        depth: params.withAim
          ? direction === "forward"
            ? acc.depth + acc.aim * units
            : acc.depth
          : direction === "up" || direction === "down"
          ? acc.depth + (direction === "up" ? units * -1 : units)
          : acc.depth,
      };
    },
    {
      aim: 0,
      horizontal: 0,
      depth: 0,
    }
  );

  return finalPosition.horizontal * finalPosition.depth;
};

console.log(calculateDepth(readSampleInput(), { withAim: false }));
console.log(calculateDepth(readSampleInput(), { withAim: true }));
