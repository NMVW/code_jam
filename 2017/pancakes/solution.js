// using Lodash v4.17.2 https://lodash.com/docs/4.17.4
const _ = require('lodash');

function has(stack, type) {
  return _.indexOf(stack, type);
}
function divisibleByFlipper(length, size) {
  return length % size === 0;
}
function flip(stack = []) {
  return _.map(stack, (pancake) => {
    switch (pancake) {
      case '+':
        return '-';
        break;
      case '-':
        return '+';
        break;
    }
  });
}

function numberOfFlips(stack = [], flips = 0, flipperSize = 0) {
  _.last(stack) === ' ' ? stack.pop(): null;
  console.log('stack', stack, flips, flipperSize);

  // EDGE CASES
  if (has(stack, '-') && flipperSize > stack.length) {
    return 'IMPOSSIBLE';
  } else if (flipperSize === stack.length && has(stack, '-') && has(stack, '+')) {
    return 'IMPOSSIBLE';
  }

  // happy streak reduces stack size so baddie is always in front of pan
  while (stack[0] === '+') {
    stack.shift();
  }
  while (stack[stack.length - 1] === '+') {
    stack.pop();
  }
  
  // BASE CASE
  // only goodies in that slice :)
  if (stack.length === 0) {
    return flips;
  }
  stack.reverse(); // chop from other side of row
  // firstBadIndex is 0 (we chopped off goodies)
  let firstGoodIndex = _.indexOf(stack, '+');

  // BASE CASE
  if (firstGoodIndex === -1 && divisibleByFlipper(stack.length, flipperSize)) {
    // all baddies but divisible by flipper!
    flips += stack.length / flipperSize;
    return flips;
  }

  // continue flipping until stack is ordered
  // firstBadIndex will always be 0  and firstGoodIndex is the end of bad streak
  let streakLength = firstGoodIndex;
  
  // perfect flips (all baddies to goodies)
  if (divisibleByFlipper(streakLength, flipperSize)) {
   
    // flip all bads until they become good
    front = stack.slice(0, firstGoodIndex);
    back = stack.slice(firstGoodIndex);
    stack = flip(front).concat(back);
    flips += streakLength / flipperSize;

    return numberOfFlips(stack, flips, flipperSize);
  } else if (streakLength < flipperSize){
    // flip once to get rid of baddies on the front, but some goodies will go bad
    front = stack.slice(0, flipperSize);
    back = stack.slice(flipperSize);
    stack = flip(front).concat(back);
    flips++;

    return numberOfFlips(stack, flips, flipperSize);
  } else if (streakLength > flipperSize) {
    
    let unevenFlips = Math.ceil(streakLength / flipperSize);
    // flip 1 more than divisibility to ensure all baddies are gone from front
    front = stack.slice(0, flipperSize * unevenFlips - 1);
    back = stack.slice(flipperSize * unevenFlips - 1);
    stack = flip(front).concat(back);
    flips += unevenFlips;
    
    return numberOfFlips(stack, flips, flipperSize);
  }
  return flips;
}

function solve(inputs, numOfCases) {
  let answers = inputs.map((input) => {
    input = input.split(' ');
    return numberOfFlips(input[0].split(''), 0, input[input.length - 1])
  });
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