// native NodeJS module 'fs'
const fs = require('fs');
let solution = require('./2017/stalls/solution.js');

// SOLUTION to PROBLEM
fs.readFile('./2017/stalls/C-small-practice-2.in', 'utf8',
  (err, data) => {
    let raw_input = data.split('\n');
    let inputs = raw_input.slice(1);
    let outputs = solution(inputs, +raw_input[0]);
    fs.writeFile('./2017/stalls/C-small-practice-2.out', outputs, 'utf8', (err,data) => console.log(err));
  }
);
