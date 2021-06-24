const cols = 75;
const rows = 75;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];

let start;
let end;
let w;
let h;
let path = [];

function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

//calculating heuristic value
function heuristic(a, b) {
  //calculate diagonal distance
  const d = dist(a.i, a.j, b.i, b.j);
  // const d = abs(a.i - b.i) + abs(a.j - b.j);
  let distance = dist()
  return d;
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.3) {
    this.wall = true;
  }

  this.show = function (color) {
    fill(color);
    if (this.wall) {
      fill(0);
    }
    stroke(220);
    rect(this.i * w, this.j * h, w, h);
  };
  this.addNeighbors = function (grid) {
    const i = this.i;
    const j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i > cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}

function setup() {
  createCanvas(1200, 1200);
  w = width / cols;
  h = height / rows;
  console.log("A*");
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  console.log(grid);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  // end = grid[18][10];

  openSet.push(start);
}

function draw() {
  if (openSet.length > 0) {
    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      //minimum f-score spot in openSet
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    const current = openSet[winner];
    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    if (current === end) {
      noLoop();
      console.log("DONE!");
      // return;
    }
    removeFromArray(openSet, current);
    closedSet.push(current);
    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        const tempG = current.g + 1;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
      }
    }
  } else {
    // no solution
    console.log("No Solution Found");
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(209, 50, 201));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(50, 150, 217));
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(100, 255, 255));
  }
}
