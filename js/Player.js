
function Player(cell) {
  this.cell = cell;
  this.movements = 0;
  this.successMovements = 0;

  function isAllowedToMove(cell) {
    return cell && cell.isEmpty();
  }

  this._move = function(cell) {
    if (isAllowedToMove(cell)) {
      this.cell = cell;
      this.successMovements++;
    }
    this.movements++;
  }

  this.getPosition = function() {
    return this.cell;
  }

  this.moveUp = function() {
    this._move(this.cell.getUp());
  }

  this.moveDown = function() {
    this._move(this.cell.getDown());
  }

  this.moveRight = function() {
    this._move(this.cell.getRight());
  }

  this.moveLeft = function() {
    this._move(this.cell.getLeft());
  }

  this.moveForward = function() {
    this._move(this.cell.getForward());
  }

  this.moveBackward = function() {
    this._move(this.cell.getBackward());
  }

  this.getUp = function(cell, num) {
    return cell.getUp(num);
  }

  this.getDown = function(cell, num) {
    return cell.getDown(num);
  }

  this.getRight = function(cell, num) {
    return cell.getRight(num);
  }

  this.getLeft = function(cell, num) {
    return cell.getLeft(num);
  }

  this.getForward = function(cell, num) {
    return cell.getForward(num);
  }

  this.getBackward = function(cell, num) {
    return cell.getBackward(num);
  }

  this.rotateRight = function() {
    var move = this.moveUp;
    this.moveUp = this.moveRight;
    this.moveRight = this.moveDown;
    this.moveDown = this.moveLeft;
    this.moveLeft = move;
    var direction = this.getUp;
    this.getUp = this.getRight;
    this.getRight = this.getDown;
    this.getDown = this.getLeft;
    this.getLeft = direction;
  }

  this.rotateLeft = function() {
    var move = this.moveUp;
    this.moveUp = this.moveLeft;
    this.moveLeft = this.moveDown;
    this.moveDown = this.moveRight;
    this.moveRight = move;
    var direction = this.getUp;
    this.getUp = this.getLeft;
    this.getLeft = this.getDown;
    this.getDown = this.getRight;
    this.getRight = direction;
  }

  this.rotateForward = function() {
      var move = this.moveForward;
      this.moveForward = this.moveDown;
      this.moveDown = this.moveBackward;
      this.moveBackward = this.moveUp;
      this.moveUp = move;
      var direction = this.getForward;
      this.getForward = this.getDown;
      this.getDown = this.getBackward;
      this.getBackward = this.getUp;
      this.getUp = direction;
  }

  this.rotateBackward = function() {
      var move = this.moveForward;
      this.moveForward = this.moveUp;
      this.moveUp = this.moveBackward;
      this.moveBackward = this.moveDown;
      this.moveDown = move;
      var direction = this.getForward;
      this.getForward = this.getUp;
      this.getUp = this.getBackward;
      this.getBackward = this.getDown;
      this.getDown = direction;
  }

  return this;
}
