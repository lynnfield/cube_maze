
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
    var unionFind = new UnionFind(sizeX * sizeY * sizeZ);
    var stop = sizeX * sizeY * sizeZ;
    do {
      var x, y, z, toErase;

      do {
        x = getRandomInt(0, sizeX - 1);
        y = getRandomInt(0, sizeY - 1);
        z = getRandomInt(0, sizeZ - 1);
        toErase = this.cell.getRight(x).getUp(y).getForward(z);
      } while (toErase.isEmpty());

      toErase.setEmpty(true);

      if (toErase.getUp() && toErase.getUp().isEmpty())
        unionFind.union(x + sizeX * y + sizeX * sizeY * z, x + sizeX * (y + 1) + sizeX * sizeY * z);

      if (toErase.getRight() && toErase.getRight().isEmpty())
        unionFind.union(x + sizeX * y + sizeX * sizeY * z, (x + 1) + sizeX * y + sizeX * sizeY * z);

      if (toErase.getDown() && toErase.getDown().isEmpty())
        unionFind.union(x + sizeX * y + sizeX * sizeY * z, x + sizeX * (y - 1) + sizeX * sizeY * z);

      if (toErase.getLeft() && toErase.getLeft().isEmpty())
        unionFind.union(x + sizeX * y + sizeX * sizeY * z, (x - 1) + sizeX * y + sizeX * sizeY * z);

      if (toErase.getForward() && toErase.getForward().isEmpty())
        unionFind.union(x + sizeX * y + sizeX * sizeY * z, x + sizeX * y + sizeX * sizeY * (z + 1));

      if (toErase.getBackward() && toErase.getBackward().isEmpty())
        unionFind.union(x + sizeX * y + sizeX * sizeY * z, x + sizeX * y + sizeX * sizeY * (z - 1));

    } while(!unionFind.connected(startPos, endPos) && --stop);

    this.percolations = (sizeX * sizeY * sizeZ - stop) / (sizeX * sizeY * sizeZ);

    if (mazeCreator.percolations > 0.9)
      this.difficulty = 'easy';
    else if (mazeCreator.percolations > 0.7)
      this.difficulty = 'normal';
    else if (mazeCreator.percolations > 0.5)
      this.difficulty = 'hard';
    else
      this.difficulty = 'impossible';

    console.log('percolations ' + (sizeX * sizeY * sizeZ - stop) / (sizeX * sizeY * sizeZ));
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return this;
}
