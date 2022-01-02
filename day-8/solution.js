const fs = require("fs");
const path = require("path");

const readSampleInput = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
    const sequences = [];
    data
      .toString()
      .split("\n")
      .forEach((line) => {
        const [seq, output] = line.split("|");
        sequences.push([seq.trim().split(" "), output.trim().split(" ")]);
      });
    return sequences;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const knownSegmentLengths = [2, 3, 4, 7];
const countKnownSegments = (input) => {
  let total = 0;
  input.forEach(([, output]) => {
    output.forEach((digit) => {
      total = total + (knownSegmentLengths.includes(digit.length) ? 1 : 0);
    });
  });
  return total;
};

console.log(countKnownSegments(readSampleInput()));

/**
 * 1. build a map that looks like this:
 * where a letter corresponds to a certain position:
 *   dddd
 *  e    a
 *  e    a
 *   ffff
 *  g    b
 *  g    b
 *   cccc
 * {
 * 0:'',
 * 1:'ab',
 * 2:'',
 * 3:'',
 * 4:'abef',
 * 5:'',
 * 6:'',
 * 7:'abd',
 * 8:'abcdefg',
 * 9: ''
 * }
 *
 * 2. 0, 6, 9 are built by 6 segments, so each is missing a letter from the parts of 8
 *  - 0 is missing e or f // 4 - 1
 *  - 6 is missing a or b // 1
 *  - 9 is missing g or c // remaining
 *
 * - 3 is letters of 9 without one of the letters of 4;
 * - 2 has only one letter of 4
 * - 5 has both letters of 4
 *
 *  - loop through the segments with 6 letters
 *  - assign to number when determining which letter is missing
 *
 * 3. fill remaining gaps
 *
 * 4. decode
 */

const az = (str) =>
  str.sort((a, b) => {
    if (b > a) return -1;
    if (a > b) return 1;
    return 0;
  });

const sample = [
  [
    "acedgfb",
    "cdfbe",
    "gcdfa",
    "fbcad",
    "dab",
    "cefabd",
    "cdfgeb",
    "eafb",
    "cagedb",
    "ab",
  ],
  ["cdfeb", "fcadb", "cdfeb", "cdbaf"],
];

const lengthToNum = [
  [2, 1],
  [3, 7],
  [4, 4],
  [7, 8],
];

const mapKnownLengths = (mapper, seq) => {
  const hasKnownLength = lengthToNum.findIndex((v) => seq.length === v[0]);
  if (hasKnownLength > -1) {
    const [, num] = lengthToNum[hasKnownLength];
    mapper[num] = az(seq.split(""));
  }
};

const is069Possibles = (seq, missing) => {
  if (seq.length !== 6) return -1;
  let value = -1;
  value = missing.pairForZero.every((missingLetter) =>
    seq.includes(missingLetter)
  )
    ? value
    : 0;
  value = missing.pairForSix.every((missingLetter) =>
    seq.includes(missingLetter)
  )
    ? value
    : 6;
  value = missing.pairForNine.every((missingLetter) =>
    seq.includes(missingLetter)
  )
    ? value
    : 9;
  return value;
};

const is235Possibles = (seq, missing) => {
  if (seq.length !== 5) return -1;
  let value = -1;
  value = missing.isValue(3)(seq);
  if (value > -1) return value;
  value = missing.isValue(5)(seq);
  if (value > -1) return value;
  value = missing.isValue(2)(seq);
  return value;
};

const pairForZero = (lettersFour, lettersOne) =>
  lettersFour.filter((lf) => !lettersOne.includes(lf));

const pairForNine = (allLetters, lettersFour, lettersSeven) => {
  return allLetters
    .filter((al) => !lettersFour.includes(al))
    .filter((al) => !lettersSeven.includes(al));
};

const decode = (sequence, letterMap) => {
  let lettersToNumberMap = {};
  for (const [key, value] of Object.entries(letterMap)) {
    const letters = value.join("");
    lettersToNumberMap[letters] = key;
  }

  let res = "";

  sequence.forEach((seq) => {
    const toAssign = az(seq.split("")).join("");
    res += lettersToNumberMap[toAssign];
  });
  return res;
};

const decodeValue = ([gibberish, targetSequence]) => {
  let lettersForNum = Array.from({ length: 10 }).reduce((acc, _, index) => {
    acc[index] = [];
    return acc;
  }, {});

  gibberish.forEach((sequence) => {
    mapKnownLengths(lettersForNum, sequence);
  });

  const missing = {
    pairForZero: pairForZero(lettersForNum[4], lettersForNum[1]),
    pairForSix: lettersForNum[1],
    pairForNine: pairForNine(
      lettersForNum[8],
      lettersForNum[4],
      lettersForNum[7]
    ),
  };

  const remainingMissing = (target) => (sequence) => {
    if (target === 3) {
      const lettersOfNine = lettersForNum[9];
      const [p1, p2] = missing.pairForZero.map((l) =>
        lettersOfNine.filter((ltr) => ltr !== l).join("")
      );
      const seq = az(sequence).join("");

      return seq === p1 || seq === p2 ? target : -1;
    } else if (target === 2) {
      return missing.pairForZero.some((l) => sequence.includes(l))
        ? target
        : -1;
    } else {
      return missing.pairForZero.every((l) => sequence.includes(l))
        ? target
        : -1;
    }
  };

  gibberish.forEach((sequence) => {
    const seq = sequence.split("");
    const possible = is069Possibles(seq, missing);
    if (possible > -1) {
      lettersForNum[possible] = az(seq);
    }
  });

  gibberish.forEach((sequence) => {
    const seq = sequence.split("");
    const remainingPossible = is235Possibles(seq, {
      isValue: remainingMissing,
    });
    if (remainingPossible > -1) {
      lettersForNum[remainingPossible] = az(seq);
    }
  });

  return decode(targetSequence, lettersForNum);
};

const solve = (input) => {
  let sum = 0;
  input.forEach((line) => {
    sum += +decodeValue(line);
  });
  return sum;
};

// this is one of the most down-bad code i've ever written
// ...and i've written some terrible code ...but it works :/
console.log(solve(readSampleInput()));
