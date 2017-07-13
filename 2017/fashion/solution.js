'use strict';
// using Lodash v4.17.2 https://lodash.com/docs/4.17.4
const _ = require('lodash');

const pointValue = {
  "x": 1,
  "+": 1,
  "o": 2,
  ".": 0
};
function prettifyGrid(grid) {
  return _.reduce(grid,
    (output, row) => {
      output += row.join(' ');
      output += '\n';
      return output;
    }, ''
  );
}

// input grid return boolean if rule break
function validRowOrColumn(grid) {
  // (no more than 1 'o' or 1 'x' in a row or column)
  let rowViolated = _.reduce(grid,
    (violation, row) => {
      if (!violation) {
        let colModels = _.filter(row, (cell) => (cell === 'o') || (cell === 'x'));
        let uniqColModels = _.uniq(colModels);
        violation = colModels.length !== uniqColModels.length ? true: false;  
      }
      return violation;
    }, false
  );
  let rowModels = _.map((row) => row[0]);
  let uniqRowModels = _.uniq(rowModels);
  let colViolated = rowModels.length !== uniqRowModels.length ? true: false;
  return !(rowViolated || colViolated);
}

// input grid return boolean if rule breaks
function validDiagonal(grid) {
  // (no more than 1 'o' or 1 '+' in a diagonal)
  // {valueA: [cellAi, cellAj,...], valueB: [...]}
  let diagonalSets = {};
  // check that values only have 1 'o' or 1 '+' per list

  let r = 0;
  for (; r < grid.length; r++) {
    let c = 0;
    for (; c < grid.length; c++) {
      // for cell grid[r][c] calc sum diag and diff diag values
      let sum = r + c;
      let diff = r - c;
      let skip = sum === diff;
      // check sum diag
      if (diagonalSets[sum]) {
        diagonalSets[sum].push(grid[r][c]);
      } else {
        diagonalSets[sum] = [grid[r][c]];
      }
      // check diff diag
      if (!skip && diagonalSets[diff]) {
        diagonalSets[diff].push(grid[r][c]);
      } else {
        diagonalSets[diff] = [grid[r][c]];
      }
    }
  }
  // console.log('diagonal_sets', diagonalSets);
  let violation = _.reduce(diagonalSets,
    (violation, cells, diagonalValue) => {
      // in the diagonals, cannot have more than 1 o or 1 +
      if (!violation) {
        let o_and_pluses = _.filter(cells, (cell) => (cell === 'o') || (cell === '+'));
        let uniqCells = _.uniq(o_and_pluses);
        violation = o_and_pluses.length !== uniqCells.length ? true: false;
      }
      return violation;
    }, false
  );
  return violation;   
}

function validGrid(grid) {
  // console.log(prettifyGrid(grid));
  return validRowOrColumn(grid) && validDiagonal(grid);
}

function calcScore(grid) {
  return _.reduce(grid,
    (score, column) => {
      score += _.reduce(column,
        (colScore, cell) => {
          colScore += pointValue[cell];
          return colScore;
        }, 0
      );
      return score;
    }, 0
  );
}

function solveGrid(grid, maxScore, modelsAdded = [], index = '') {
  maxScore = maxScore || calcScore(grid);
  index = index || '00';
  if (index === `${grid.length-1}${grid.length-1}`) {
    return [grid, maxScore, modelsAdded, index];
  }
  // i.e. ['x13', 'o34']
  // console.log('INPUT GRID:')
  // console.log(prettifyGrid(grid));
  // console.log('maxscore', maxScore, modelsAdded);
  
//   RULES
//   1. Whenever any two models share a row or column, at least one of the two must be a +. (no more than 1 'o' or 1 'x' in a row or column)
//   2. Whenever any two models share a diagonal of the grid, at least one of the two must be an x. (no more than 1 'o' or 1 '+' in a diagonal)
//   3. 'x' or '+' are 1 pt, 'o' are 2pts, '.' are 0pts
//   4. You are free to place any number (including zero) of additional models of whichever types you like. 
//      You may not remove existing models, but you may upgrade as many existing + and x models into o models as you wish, as long as the above rules are not violated.

// ALGO: Formally, a model located in row i0 and column j0 and a model located in row i1 and column j1 share a row if and only if i0 = i1, 
//       they share a column if and only if j0 = j1, and they share a diagonal if and only if i0 + j0 = i1 + j1 or i0 - j0 = i1 - j1.
  
  // keep track of model substitution/additions and positions
  
  // check each cell of grid, mutating it if allowed and beneficial
  let i = +index[0] || 0;
  for (; i < grid.length; i++) {
    // rows
    let j = +index[1] || 0;
    for (; j < grid.length; j++) {
      // for each cell, place a model and recurse if possible
      (function (i, j) {
        let models = ['x', 'o', '+'];
        
        let scores = _.map(models,
          (type) => {
            let gridAddType = grid.slice(0);

            // try to add type to grid
            gridAddType[i][j] = type;
            let gridTypeScore = calcScore(gridAddType);

            if (validGrid(gridAddType)) {
              console.log('VALID GRID:')
              console.log(prettifyGrid(gridAddType));
              console.log(validGrid(gridAddType));
              return gridTypeScore;
            } else {
              return null;
            }
        })
        let newMaxScore = Math.max.apply(null, scores);

        // make sure old score is not still max
        if (newMaxScore !== maxScore) {
          // newMaxscore is a valid max score of a valid grid change
          let newGrid = grid.slice(0);
          let typeId = _.findIndex(scores, (score) => score === newMaxScore);
          let type = models[typeId]; // winner 0 'x' 1 'o' 2 '+'
          modelsAdded.push(`${type}${i+1}${j+1}`);
          newGrid[i][j] = type;
          [grid, maxScore, modelsAdded, index] = solveGrid(newGrid, newMaxScore, modelsAdded, i+''+j);          
        } else {
          // no grid made a change
        }
      })(i, j)
    }
  }
  // console.log('grid data', [grid, maxScore, modelsAdded, index]);
  return [grid, maxScore, modelsAdded, index];
}

function solve(inputs, numOfCases) {
  let answers = inputs.map((grid) => {
    let stringOut = '';
    console.log('grid:');
    console.log(prettifyGrid(grid));
    console.log('solution:');
    let solution = solveGrid(grid, 0);
    console.log(solution);
    solution = solution.slice(1, -1);
    // 'points nModels'
    stringOut += `${solution[0]} ${solution[1].length}`;
    if (solution[1].length) {
      _.forEach(solution[1],
        (model) => {
          stringOut += `\n${model[0]} ${model[1]} ${model[2]}`;
      });
    }
    return stringOut;
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