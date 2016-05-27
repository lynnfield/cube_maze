
function Player(cell) {
  this.cell = cell;
  this.movements = 0;
  this.successMovements = 0;

  function isAllowedToMove(cell) {
    return cell && cell.isEmpty();
  }

  this.getPosition = function() {
    return this.cell;
  }

  this.moveUp = function() {
    var cell = this.cell.getUp();
    if (isAllowedToMove(cell)) {
      this.cell = cell;
      this.successMovements++;
    }
    this.movements++;
  }

  this.moveRight = function() {
    var cell = this.cell.getRight();
    if (isAllowedToMove(cell)) {
      this.cell = cell;
      this.successMovements++;
    }
    this.movements++;
  }

  this.moveDown = function() {
    var cell = this.cell.getDown();
    if (isAllowedToMove(cell)) {
      this.cell = cell;
      this.successMovements++;
    }
    this.movements++;
  }

  this.moveLeft = function() {
    var cell = this.cell.getLeft();
    if (isAllowedToMove(cell)) {
      this.cell = cell;
      this.successMovements++;
    }
    this.movements++;
  }

  this.rotateRight = function() {
    var tmp = this.moveUp;
    this.moveUp = this.moveRight;
    this.moveRight = this.moveDown;
    this.moveDown = this.moveLeft;
    this.moveLeft = tmp;
  }

  this.rotateLeft = function() {
    var tmp = this.moveUp;
    this.moveUp = this.moveLeft;
    this.moveLeft = this.moveDown;
    this.moveDown = this.moveRight;
    this.moveRight = tmp;
  }

  return this;
}
