function Player(cell) {
    this.cell = cell;
    this.movements = 0;
    this.successMovements = 0;

    return this;
}

function isAllowedToMove(cell) {
    return cell && cell.isEmpty();
}

Player.prototype._move = function (cell) {
    if (isAllowedToMove(cell)) {
        this.cell = cell;
        this.successMovements++;
    }
    this.movements++;
};

Player.prototype.getPosition = function () {
    return this.cell;
};

Player.prototype.moveUp = function () {
    this._move(this.cell.getUp());
};

Player.prototype.moveDown = function () {
    this._move(this.cell.getDown());
};

Player.prototype.moveRight = function () {
    this._move(this.cell.getRight());
};

Player.prototype.moveLeft = function () {
    this._move(this.cell.getLeft());
};

Player.prototype.moveForward = function () {
    this._move(this.cell.getForward());
};

Player.prototype.moveBackward = function () {
    this._move(this.cell.getBackward());
};

Player.prototype.getUp = function (cell, num) {
    return cell.getUp(num);
};

Player.prototype.getDown = function (cell, num) {
    return cell.getDown(num);
};

Player.prototype.getRight = function (cell, num) {
    return cell.getRight(num);
};

Player.prototype.getLeft = function (cell, num) {
    return cell.getLeft(num);
};

Player.prototype.getForward = function (cell, num) {
    return cell.getForward(num);
};

Player.prototype.getBackward = function (cell, num) {
    return cell.getBackward(num);
};

Player.prototype.rotateRight = function () {
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
};

Player.prototype.rotateLeft = function () {
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
};

Player.prototype.rotateForward = function () {
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
};

Player.prototype.rotateBackward = function () {
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
};

Player.prototype.rollLeft = function () {
    var move = this.moveForward;
    this.moveForward = this.moveRight;
    this.moveRight = this.moveBackward;
    this.moveBackward = this.moveLeft;
    this.moveLeft = move;

    var direction = this.getForward;
    this.getForward = this.getRight;
    this.getRight = this.getBackward;
    this.getBackward = this.getLeft;
    this.getLeft = direction;
};

Player.prototype.rollRight = function () {
    var move = this.moveForward;
    this.moveForward = this.moveLeft;
    this.moveLeft = this.moveBackward;
    this.moveBackward = this.moveRight;
    this.moveRight = move;

    var direction = this.getForward;
    this.getForward = this.getLeft;
    this.getLeft = this.getBackward;
    this.getBackward = this.getRight;
    this.getRight = direction;
};
