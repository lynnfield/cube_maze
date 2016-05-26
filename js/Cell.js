
function Cell(x, y) {
  this.x = x;
  this.y = y;

  var Up = null, right = null, Down = null, left = null;
  var content = null;

  this.getUp = function(num) {
    var ret = Up;
    if (num && num > 1)
      while (ret && --num > 0)
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
      while (ret && --num > 0)
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
      while (ret && --num > 0)
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
      while (ret && --num > 0)
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

  this.empty = true;

  this.isEmpty = function() {
    return this.empty;
  }

  this.setEmpty = function(val) {
    this.empty = val;
  }

  this.light = false;

  this.hasLight = function() {
    return this.light;
  }

  this.setLight = function(val) {
    this.light = true;
  }

  return this;
}
