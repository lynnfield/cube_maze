
function MazeCreator(sizeX, sizeY, sizeZ) {
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.sizeZ = sizeZ;

  this.cell = null;

  this.start = null;
  this.end = null;

  this.percolations = 0;

  this.generate = function () {
    var left = null, down = null, backward = null;

    // fill maze
    // generate floor
    for (var i = 0; i < sizeZ; ++i) {
      // generate row
      for (var j = 0; j < sizeY; ++j) {
        // generate cell
        for (var k = 0; k < sizeX; ++k) {
          this.cell = new Cell(0,0,0);
          if (left)
            left.setRight(this.cell);

          left = this.cell;

          if (down) {
            down.setUp(this.cell);
            down = down.getRight();
          }

          if (backward) {
            backward.setForward(this.cell);
            backward = backward.getRight();
          }

          this.cell.setEmpty(false);
        }

        left = null;
        down = this.cell.getLeftEnd();
        if (down.getBackward())
          backward = down.getBackward().getUp();
      }

      down = null;
      backward = this.cell.getLeftEnd().getDownEnd();
    }

    this.cell = this.cell.getDownEnd().getLeftEnd().getBackwardEnd();

    // select random start & end
    this.start = this.cell.getRight(getRandomInt(0, sizeX - 1));
    this.end = this.cell.getUpEnd().getForwardEnd().getRight(getRandomInt(0, sizeX - 1));
    this.start.setEmpty(true);
    this.end.setEmpty(true);

    // generate maze
    var startPos
      = Math.abs(this.start.x)
      + Math.abs(sizeX * this.start.y)
      + Math.abs(sizeX * sizeY * this.start.z);
    var endPos
      = Math.abs(this.end.x)
      + Math.abs(sizeX * this.end.y)
      + Math.abs(sizeX * sizeY * this.end.z);
    var size = sizeX * sizeY * sizeZ;
    var objectLeft = size;
    var unionFind = new UnionFind(size);
    do {
      var x, y, z, toErase, position;

      do {
        x = getRandomInt(0, sizeX - 1);
        y = getRandomInt(0, sizeY - 1);
        z = getRandomInt(0, sizeZ - 1);
        toErase = this.cell.getRight(x).getUp(y).getForward(z);
      } while (toErase.isEmpty());

      toErase.setEmpty(true);

      position = x + sizeX * y + sizeX * sizeY * z;

      if (toErase.getUp() && toErase.getUp().isEmpty())
        unionFind.union(position, x + sizeX * (y + 1) + sizeX * sizeY * z);

      if (toErase.getRight() && toErase.getRight().isEmpty())
        unionFind.union(position, (x + 1) + sizeX * y + sizeX * sizeY * z);

      if (toErase.getDown() && toErase.getDown().isEmpty())
        unionFind.union(position, x + sizeX * (y - 1) + sizeX * sizeY * z);

      if (toErase.getLeft() && toErase.getLeft().isEmpty())
        unionFind.union(position, (x - 1) + sizeX * y + sizeX * sizeY * z);

      if (toErase.getForward() && toErase.getForward().isEmpty())
        unionFind.union(position, x + sizeX * y + sizeX * sizeY * (z + 1));

      if (toErase.getBackward() && toErase.getBackward().isEmpty())
        unionFind.union(position, x + sizeX * y + sizeX * sizeY * (z - 1));

    } while(!unionFind.connected(startPos, endPos) && --objectLeft);

    this.percolations = (size - objectLeft) / (size);

    if (mazeCreator.percolations > 0.9)
      this.difficulty = 'easy';
    else if (mazeCreator.percolations > 0.7)
      this.difficulty = 'normal';
    else if (mazeCreator.percolations > 0.5)
      this.difficulty = 'hard';
    else
      this.difficulty = 'impossible';

    console.log('percolations ' + this.percolations);
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return this;
}
