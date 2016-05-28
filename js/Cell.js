
function Cell(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.empty = true;

  return this;
}

Cell.prototype._get = function (item, iterator, num) {
  if (num == undefined || num == 1)
    return item;
  if (num == 0)
    return this;
  var ret = item;
  if (num && num > 1)
    while (ret && --num > 0)
      ret = iterator.call(ret);
  return ret;
}

function getEnd(item, iterator) {
  var ret = item;
  while (iterator.call(ret))
    ret = iterator.call(ret);
  return ret;
}

Cell.prototype._up = null;

Cell.prototype.getUp = function getUp(num) {
  return this._get(this._up, getUp, num);
}

Cell.prototype.getUpEnd = function() {
  return getEnd(this, this.getUp);
}

Cell.prototype.setUp = function(cell) {
  if (this._up == cell) return;

  this._up = cell;
  cell.y = this.y + 1;
  cell.setDown(this);
}

Cell.prototype._right = null;

Cell.prototype.getRight = function getRight(num) {
  return this._get(this._right, getRight, num);
}

Cell.prototype.getRightEnd = function() {
  return getEnd(this, this.getRight);
}

Cell.prototype.setRight = function(cell) {
  if (this._right == cell) return;

  this._right = cell;
  cell.x = this.x + 1;
  cell.setLeft(this);
}

Cell.prototype._down = null;

Cell.prototype.getDown = function getDown(num) {
  return this._get(this._down, getDown, num);
}

Cell.prototype.getDownEnd = function() {
  return getEnd(this, this.getDown);
}

Cell.prototype.setDown = function(cell) {
  if (this._down == cell) return;

  this._down = cell;
  cell.y = this.y - 1;
  cell.setUp(this);
}

Cell.prototype._left = null;

Cell.prototype.getLeft = function getLeft(num) {
  return this._get(this._left, getLeft, num);
}

Cell.prototype.getLeftEnd = function() {
  return getEnd(this, this.getLeft);
}

Cell.prototype.setLeft = function(cell) {
  if (this._left == cell) return;

  this._left = cell;
  cell.x = this.x - 1;
  cell.setRight(this);
}

Cell.prototype._forward = null;

Cell.prototype.getForward = function getForward(num) {
  return this._get(this._forward, getForward, num);
}

Cell.prototype.getForwardEnd = function () {
  return getEnd(this, this.getForward);
}

Cell.prototype.setForward = function (cell) {
  if (this._forward == cell) return;

  this._forward = cell;
  cell.z = this.z - 1;
  cell.setBackward(this);
}

Cell.prototype._backward = null;

Cell.prototype.getBackward = function getBackward(num) {
  return this._get(this._backward, getBackward, num);
}

Cell.prototype.getBackwardEnd = function() {
  return getEnd(this, this.getBackward);
}

Cell.prototype.setBackward = function (cell) {
  if (this._backward == cell) return;

  this._backward = cell;
  cell.z = this.z + 1;
  cell.setForward(this);
}

Cell.prototype.isEmpty = function() {
  return this.empty;
}

Cell.prototype.setEmpty = function(val) {
  this.empty = val;
}
