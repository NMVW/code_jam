// using Lodash v4.17.2 https://lodash.com/docs/4.17.4
const _ = require('lodash');

function isTidy(x) {
  let digits = _.map((x + '').split(''), (d) => +d);
  return _.reduce(digits,
    (tidy, digit) => {
      if (tidy.still && digit >= tidy.prev) {
        tidy.prev = digit;
      } else {
        tidy.still = false;
      }
      return tidy;
    },
    {prev: digits[0], still: true}
  ).still;
}

function findLastTidy(n) {

  // start at n and count down to 1 find last tidy
  while (n >= 1) {
    // we need to skip numbers
    
    if (isTidy(n)) {
      console.log(n);
      return n;
    }
    n--;
  }

  return 1;
}

function solve(inputs, numOfCases) {
  let answers = inputs.map((input) => findLastTidy(input));
  console.log(_.zip(inputs, answers)); 

  // for n, create unique list of digits
  // if list is not 10 length
  // continued 2*n... until list is 10 length
  let output = `Case #1: ${answers[0]}`;
  for (let i = 2; i <= numOfCases; i++) {
    output += `\nCase #${i}: ${answers[i-1]}`;
  }
  return output;
}
    
module.exports = solve;