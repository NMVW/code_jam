// native NodeJS module 'fs'
const fs = require('fs');
const _ = require('lodash');
let solution = require('./solution.js');

function isAModel(value) {
  return ['x', '+', 'o'].indexOf(value) !== -1;
};

function modelsFromString(models) {
  return _.reduce(models,
    (models, value) => {
      if (isAModel(value)) {
        // start new model spec
        models.push(value);
      } else {
        // r or c coordinate for model
        models[models.length - 1] = models[models.length - 1].concat(value);
      }
      return models;
    }, []
  );
}

function buildGrid(size) {
  let i = 0;
  let rows = [];
  // build rows
  for (; i < size; i++) {
    rows.push([]);

    let j = 0;
    // build columns
    for (; j < size; j++) {
      rows[i].push('.')
    }
  }
  return rows;
}

function initializeGrid(group) {
  let grid = [];
  let models = [];
  let gridSize = 0;

  // 1. find models
  let modelStartIndex = _.findIndex(group, (model) => isAModel(model));
  if (modelStartIndex !== -1) {
    models = modelsFromString(group.slice(modelStartIndex));
  }
  // 2. build grid
  gridSize = +group.slice(0, modelStartIndex)[0];
  grid = buildGrid(gridSize);
  
  // 3. populate grid
  if (models.length) {
    _.forEach(models,
      (model) => {
        let [r, c] = [model[1], model[2]];
        grid[r-1][c-1] = model[0];
      }
    );
  }  

  return grid;
}

// SOLUTION to PROBLEM
fs.readFile('./D-small-attempt0.in', 'utf8',
  (err, data) => {
    let raw_input = data.split('\n');
    let lines = raw_input.slice(1);
    // from lines, group lines into input for grid builder
    let groups = _.reduce(lines,
      (groups, line) => {
        // model spec
        let model = line.slice(0, 1);
        if (isAModel(model)) {
          groups[groups.length - 1] = groups[groups.length - 1].concat(' ' + line);          
        } else {
          // start new group with line as header for grid
          groups.push(line);
        }
        return groups;
      }, []
    );

    let inputGrids = _.map(groups, (group) => initializeGrid(group.split(' ')));    
    
    let outputs = solution(inputGrids, +raw_input[0]);  
    fs.writeFile('./D-small-attempt0.out', outputs, 'utf8', (err,data) => console.log(err));
  }
);
