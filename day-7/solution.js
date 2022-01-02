const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    return data
      .toString()
      .split(",")
      .map((v) => +v);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const costly = (v) => {
  const diff = Math.abs(v);
  return (diff * (diff + 1)) / 2;
};

const fuelCost = (input, target, params) =>
  input
    .map((v) => (params.part === 1 ? Math.abs(v - target) : costly(v - target)))
    .reduce((acc, v) => acc + v);

const calculateLeastCost = (input, params) => {
  const min = Math.min(...input);
  const max = Math.max(...input);
  let minFuelCost = Infinity;
  for (let i = min; i <= max; i++) {
    const cost = fuelCost(input, i, params);
    if (cost < minFuelCost) {
      minFuelCost = cost;
    }
  }
  return minFuelCost;
};

console.log(calculateLeastCost(readSampleInput(), { part: 1 }));
console.log(calculateLeastCost(readSampleInput(), { part: 2 }));
