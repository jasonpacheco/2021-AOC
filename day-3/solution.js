const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    return data
      .toString()
      .split("\n")
      .map((line) => line.split("").map((n) => Number(n)));
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sample = [
  "00100",
  "11110",
  "10110",
  "10111",
  "10101",
  "01111",
  "00111",
  "11100",
  "10000",
  "11001",
  "00010",
  "01010",
].map((line) => line.split("").map((n) => Number(n)));

const getCommonBitForPosition = (
  input,
  position,
  params = { type: "most" }
) => {
  const sums = input.reduce(
    (acc, curr) => {
      acc[curr[position]]++;
      return acc;
    },
    [0, 0]
  );
  const commonNumber =
    params.type === "most" ? Math.max(...sums) : Math.min(...sums);

  if (sums[0] === sums[1]) return params.type === "most" ? 1 : 0;
  return sums.findIndex((v) => v === commonNumber);
};

const getPower = (input) => {
  const numberSize = input[0].length;
  const gammaDigits = [];
  for (let i = 0; i < numberSize; i++) {
    gammaDigits.push(getCommonBitForPosition(input, i));
  }
  const epsilonDigits = gammaDigits.map((d) => +!d);
  const gamma = parseInt(gammaDigits.join(""), 2);
  const epsilon = parseInt(epsilonDigits.join(""), 2);

  return gamma * epsilon;
};

const getRating = (input, params) => {
  const numberSize = input[0].length;
  let target = input.slice();
  for (let i = 0; i < numberSize; i++) {
    const commonDigit = getCommonBitForPosition(target, i, params);
    target = target.reduce((acc, curr) => {
      if (curr[i] === commonDigit) return [...acc, curr];
      return acc;
    }, []);
  }
  const [rating] = target;
  return parseInt(rating.join(""), 2);
};

console.log(getPower(readSampleInput()));

const getLifeSupportRating = (input) => {
  const oxygenGeneratorRating = getRating(input, { type: "most" });
  const carbonDioxideScrubberRating = getRating(input, { type: "least" });
  return oxygenGeneratorRating * carbonDioxideScrubberRating;
};

console.log(getLifeSupportRating(readSampleInput()));
