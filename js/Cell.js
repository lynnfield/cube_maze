
function Cell(x, y) {
  this.x = x;
  this.y = y;

  var Up = null, right = null, Down = null, left = null;
  var content = null;

  this.getUp = function(num) {
    var ret = Up;
    if (num && num > 1)
      while (--num > 0)
        ret = ret.getUp();
    return ret;
  }

  this.getUpEnd = function() {
    var ret = this;
    while (ret.getUp())
      ret = ret.getUp();
    return ret;
  }

  this.setUp = function(cell) {
    if (Up == cell) return;

    Up = cell;
    cell.y = this.y + 1;
    cell.setDown(this);
  }

  this.getRight = function(num) {
    var ret = right;
    if (num && num > 1)
      while (--num > 0)
        ret = ret.getRight();
    return ret;
  }

  this.getRightEnd = function() {
    var ret = this;
    while (ret.getRight())
      ret = ret.getRight();
    return ret;
  }

  this.setRight = function(cell) {
    if (right == cell) return;

    right = cell;
    cell.x = this.x + 1;
    cell.setLeft(this);
  }

  this.getDown = function(num) {
    var ret = Down;
    if (num && num > 1)
      while (--num > 0)
        ret = ret.getDown();
    return ret;
  }

  this.getDownEnd = function() {
    var ret = this;
    while (ret.getDown())
      ret = ret.getDown();
    return ret;
  }

  this.setDown = function(cell) {
    if (Down == cell) return;

    Down = cell;
    cell.y = this.y - 1;
    cell.setUp(this);
  }

  this.getLeft = function(num) {
    var ret = left;
    if (num && num > 1)
      while (--num > 0)
        ret = ret.getLeft();
    return ret;
  }

  this.getLeftEnd = function() {
    var ret = this;
    while (ret.getLeft())
      ret = ret.getLeft();
    return ret;
  }

  this.setLeft = function(cell) {
    if (left == cell) return;

    left = cell;
    cell.x = this.x - 1;
    cell.setRight(this);
  }

  this.type = 0;

  this.getType = function() {
    return this.type;
  }

  this.setType = function (val) {
    this.type = val;
  }

  return this;
}

// var cell = null, left = null, up = null;
// for (var i = 0; i < 10; ++i) {
//   for (var j = 0; j < 10; ++j) {
//     cell = new Cell(0, 0);
//     if (left)
//       left.setRight(cell);
//     left = cell;
//     if (up) {
//       up.setDown(cell);
//       up = up.getRight();
//     }
//   }
//   left = null;
//   up = cell.getLeftEnd();
// }

// var cell = new Cell(0,0);
// var up, down = cell;;
// for (var i = 0; i < 5; ++ i) {
//   down.setUp(new Cell(0,0));
//   down = down.getUp();
// }
