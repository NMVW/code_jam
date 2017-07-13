// using Lodash v4.17.2 https://lodash.com/docs/4.17.4
const _ = require('lodash');

function nearestOccupied(stalls, index, side) {
  switch (side) {
    case 'left':
      let leftStalls = stalls.slice(0, index);
      return _.reduceRight(leftStalls,
        (Ls, stall) => {
          if (Ls.streak && stall === '.') {
            Ls.value++;
          } else {
            Ls.streak = false;
          }
          return Ls;
        }, {value:0, streak:true}
      ).value;
      break;
    case 'right':
      let rightStalls = stalls.slice(index + 1);
      return _.reduce(rightStalls,
        (Rs, stall) => {
          if (Rs.streak && stall === '.') {
            Rs.value++;
          } else {
            Rs.streak = false;
          }
          return Rs;
        }, {value:0, streak:true}
      ).value;
      break;
  }
}

function findLs(stalls) {
  // [null, 2, 0, 3,... , null]
  return _.map(stalls,
    (stall, index) => {
      if (stall !== null) {
        return nearestOccupied(stalls, index, 'left');
      }
      return null;
    }
  );
}

function findRs(stalls) {
  return _.map(stalls,
    (stall, index) => {
      if (stall !== null) {
        return nearestOccupied(stalls, index, 'right');
      }
      return null;
    }
  );
}
function findIndices(values, match) {
  return _.reduce(values,
      (stallIndices, value, index) => {
        if (value === match){
          stallIndices.push(index);
        }
        return stallIndices;
      }, []
    );
}

function findMaxes(Ls, Rs) {
  // Ls, Rs are indexed to match stall index in stalls
  return _.map(Ls, (value, i) => value !== null ? Math.max(Ls[i], Rs[i]): value);
}
function findMins(Ls, Rs) {
  // Ls, Rs are indexed to match stall index in stalls
  return _.map(Ls, (value, i) => value !== null ? Math.min(Ls[i], Rs[i]): value);
}

function findStallValues(stalls, people) {
  // PREPARATION
  // first and last are occupied
  if (typeof stalls === 'string') {
    let range = +stalls;
    let i = 1;
    stalls = [null];
    for (; i <= range; i++) {
      stalls.push('.');
    }
    stalls.push(null);
  }
  
  // console.log('initial people', people - 1, 'last person', people, 'stalls', stalls);
  let p = 1;
  // clear out the waiting room...
  for (; p < people; p++) {
    // only need closest occupant for relative values to compute correctly
    if (stalls[0] === null && stalls[1] === null) {
      // kill earliest occupant
      stalls.unshift();
    }
    if (stalls[stalls.length - 1] === null && stalls[stalls.length - 2] === null) {
      // kill latest occupant
      stalls.pop();
    }
    placePersonInStall(p, stalls);
  }
  
  // last person to find a stall (return max, min of Ls,Rs)
  return placePersonInStall(people, stalls);
  
  function placePersonInStall(person, stallsLeft) {
    // first person walks in and calculates all (Ls, Rs) pairs
    // side effect on stallsLeft

    let Ls = findLs(stallsLeft);
    let Rs = findRs(stallsLeft);
    let mins = findMins(Ls, Rs);
    // console.log('person:', person,'stall info:',Ls, Rs, mins);

    // min(Ls, Rs) maximal
    let maxMinValue = Math.max.apply(null, mins);

    // first consideration pool
    let maxMinIndices = findIndices(mins, maxMinValue);
    let chosenStallIndex = null;
    
    // more than 1 stall with maxMinValue match
    if (maxMinIndices.length > 1) {

      // second consideration pool
      // of the maxMinIndices stallsLeft, find max(Ls, Rs) for each stall
      let maxOfMins = _.map(mins,
        (min, i) => {
          if (maxMinIndices.indexOf(i) !== -1) {
            return Math.max(Ls[i], Rs[i]);
          }
          return null;
        }
      );
      
      let maxMaxValue = Math.max.apply(null, maxOfMins);
      let maxMaxIndices = findIndices(maxOfMins, maxMaxValue);
      
      if (maxMaxIndices.length >= 1) {
        // pick leftmost stall
        chosenStallIndex = maxMaxIndices[0];
        stallsLeft[chosenStallIndex] = null;
        // console.log('tie breaker', chosenStallIndex);
      } else {
        // pick maxMaxIndices stall
        chosenStallIndex = maxMaxIndices[0];
        stallsLeft[chosenStallIndex] = null;
        // console.log('max of the mins!', chosenStallIndex);
      }
  
    } else {
      // choose that stall!
      chosenStallIndex = maxMinIndices[0];
      stallsLeft[chosenStallIndex] = null;
      // console.log('easy choice', chosenStallIndex, maxMinIndices);
    }
    let chosenLs = Ls[chosenStallIndex];
    let chosenRs = Rs[chosenStallIndex];
    // console.log('person ', person, ' chose ', chosenStallIndex, 'Ls', chosenLs,'Rs', chosenRs);
    
    return `${Math.max(chosenLs, chosenRs)} ${Math.min(chosenLs, chosenRs)}`;
  }
}

function solve(inputs, numOfCases) {
  let answers = inputs.map((input) => {
    input = input.split(' ')
    // console.log(input[0], typeof input[0]);
    return findStallValues(input[0], input[input.length - 1]);
  });
  // console.log(_.zip(inputs, answers)); 

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