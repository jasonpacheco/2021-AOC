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

const getPopulation = (
  input,
  params = { days: 80, newCycleLength: 9, cycleLength: 7 }
) => {
  const ages = Array.from({ length: params.newCycleLength + 1 }).reduce(
    (acc, _, index) => {
      acc[index] = acc[index] ?? 0;
      return acc;
    },
    input.reduce((acc, curr) => {
      acc[curr] = (acc[curr] ?? 0) + 1;
      return acc;
    }, {})
  );

  for (let cycles = 0; cycles < params.days; cycles++) {
    const freshCycleFish = ages[0];
    for (const age in ages) {
      if (age !== "0") {
        ages[age - 1] = ages[age];
      }
    }
    ages[params.cycleLength - 1] += freshCycleFish;
    ages[params.newCycleLength - 1] = freshCycleFish;
  }

  let total = 0;
  for (const age in ages) {
    total += ages[age];
  }

  return total;
};

console.log(
  getPopulation(readSampleInput(), {
    days: 80,
    newCycleLength: 9,
    cycleLength: 7,
  })
);
console.log(
  getPopulation(readSampleInput(), {
    days: 256,
    newCycleLength: 9,
    cycleLength: 7,
  })
);
