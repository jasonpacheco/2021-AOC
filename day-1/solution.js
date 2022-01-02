const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    return data
      .toString()
      .split("\n")
      .map((n) => Number(n));
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sampleData = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

const getSingleMeasurementDelta = (input) => {
  return input.reduce(
    (acc, curr, currIndex, arr) =>
      currIndex > 0 ? acc.concat(curr - arr[currIndex - 1]) : [0],
    []
  );
};

const getThreeMeasurementWindow = (input) => {
  return input.reduce((acc, _, currIndex, arr) => {
    const threeMeasurementSlice = arr.slice(currIndex, currIndex + 3);
    if (threeMeasurementSlice.length < 3) return acc;
    const [n1, n2, n3] = threeMeasurementSlice;
    return acc.concat(n1 + n2 + n3);
  }, []);
};

const calculateNumberOfIncreases = (input) => {
  return input.reduce((acc, curr) => (curr > 0 ? acc + 1 : acc), 0);
};

console.log(
  calculateNumberOfIncreases(getSingleMeasurementDelta(readSampleInput()))
);

console.log(
  calculateNumberOfIncreases(
    getSingleMeasurementDelta(getThreeMeasurementWindow(readSampleInput()))
  )
);
