
function finalNumber(n = 0) {
  let digits = [];
  let i = 1;
  let next = n * (i + 1);

  collectDigits(n);

  while (digits.length < 10) {
    n <= 200 ? console.log('SMALL DATA SET'): console.log('LARGE DATA SET');

    next = n * (i + 1);

    if (next == n) {
      return 'INSOMNIA';
    } else {
      collectDigits(next);
    }
    i++;
  }

  function collectDigits(n = '') {
    let collection = (n+'').split('');
    // console.log(n,collection)
    collection.forEach((digit) => {
      console.log('digits:',digits,'digit:', digit, n, collection)
      if (digits.indexOf(+digit) === -1) digits.push(+digit)
    });
  }
  console.log('for n:', next, digits);
  return next;
}

function solve(inputs, numOfCases) {
  let answers = inputs.map((input) => finalNumber(input));
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