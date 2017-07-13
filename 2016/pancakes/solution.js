const _ = require('lodash');

function numberOfFlips(stack = [], flips = 0) {
  stack = typeof stack === 'string' ? stack.split(''): stack;
  console.log('stack:', stack);
  let top = [];
  let bottom = [];

  // 1. find first '-'
  // 2. find first '+'
  let firstBadIndex = _.indexOf(stack, '-');
  let firstGoodIndex = _.indexOf(stack, '+');
  // BASE CASES
  if (firstBadIndex === -1) {
    console.log('ordered stack:', stack, 'flips:', flips);
    // all good pancakes!
    return flips;
  }
  if (firstGoodIndex === -1) {
    // all bad pancakes in stack
    return numberOfFlips(flip(stack), flips);
  }

  // unbroken streak of '-'
  let secondBadIndex = firstBadIndex !== -1 ? _.reduce(stack.slice(firstBadIndex + 1),
    (secondBadIndex, pancake) => {
      if (secondBadIndex.streak && pancake === '-') {
        secondBadIndex.index++;
      } else {
        secondBadIndex.streak = false;
      }
      return secondBadIndex;
    },
    {index: firstBadIndex, streak: true}
  ).index: 0;
  console.log('firstGoodIndex', firstGoodIndex, 'firstBadIndex', firstBadIndex, 'secondBadIndex', secondBadIndex);
  
  // continue flipping until stack is ordered
  if (firstBadIndex < firstGoodIndex) {
    // we know that secondBadIndex is less than firstGoodIndex (unbroken streak)
    if (firstBadIndex === 0) {
      top = stack.slice(firstBadIndex, secondBadIndex + 1);
      bottom = stack.slice(secondBadIndex + 1);
      // 1. do a flip through second bad, no good until second bad
      stack = flip(top).concat(bottom); // everything good to second bad!
      return numberOfFlips(stack, flips);
    } else {
      top = stack.slice(0, firstBadIndex);
      bottom = stack.slice(firstBadIndex);
      // 1. do a flip of up to first bad
      stack = flip(top).concat(bottom); // everything bad until first bad

      top = stack.slice(0, secondBadIndex + 1);
      bottom = stack.slice(secondBadIndex + 1);
      // 2. do a flip of up to second bad
      stack = flip(top).concat(bottom); // everything good to second bad!
      return numberOfFlips(stack, flips);
    }
  } else {
    // firstgoodIndex < firstbadIndex   
    // we know that secondBadIndex is less than firstGoodIndex (unbroken streak)
    if (firstGoodIndex === 0) {
      top = stack.slice(firstGoodIndex, firstBadIndex);
      bottom = stack.slice(firstBadIndex);
      // 1. do a flip until first bad, only good until first bad
      stack = flip(top).concat(bottom); // everything bad to first bad!
      return numberOfFlips(stack, flips);
    } else {
      top = stack.slice(0, firstGoodIndex);
      bottom = stack.slice(firstGoodIndex);
      // 1. do a flip of up to first good
      stack = flip(top).concat(bottom); // everything bad until first good!
      return numberOfFlips(stack, flips);
      // top = stack.slice(0, firstBad);
      // bottom = stack.slice(secondBadIndex + 1);
      // // 2. do a flip of up to second bad
      // stack = flip(top).concat(bottom); // everything good to second bad!
      // return numberOfFlips(stack, flips);
    }
  }
    // keep track of changes - to + OR + to - and only flip when a '-' consecutive sequence ends
    // 3. we have a start and end index for flip
    // if firstBadIndex is not 0, then we have to flip all pancakes up until firstBadIndex first
  
  function flip(stack = []) {
    flips++;
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
  console.log('DID I GET HERE?');
}

function solve(inputs, numOfCases) {
  let answers = inputs.map((input) => numberOfFlips(input, 0));
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