

function MazeCreator(sizeX, sizeY) {
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.cell = null;
  this.start = null;
  this.end = null;
  this.percolations = 0;
  var left = null, up = null;

  this.generate = function () {
    // fill maze
    for (var i = 0; i < sizeY; ++i) {
      for (var j = 0; j < sizeX; ++j) {
        this.cell = new Cell(0, 0);
        if (left)
          left.setRight(this.cell);
          left = this.cell;
        if (up) {
          up.setUp(this.cell);
          up = up.getRight();
        }
        this.cell.setEmpty(false);
        // console.log('generated ' + ((j + i * sizeX) / (sizeX * sizeY)));
      }
      left = null;
      up = this.cell.getLeftEnd();
    }
    this.cell = this.cell.getDownEnd().getLeftEnd();

    // select random start & end
    this.start = this.cell.getRight(getRandomInt(1, sizeX - 2));
    this.end = this.cell.getUpEnd().getRight(getRandomInt(1, sizeX - 2));
    this.start.setEmpty(true);
    this.end.setEmpty(true);

    // generate maze
    var startPos = this.start.x + sizeX * this.start.y;
    var endPos = this.end.x + sizeX * this.end.y;
    var unionFind = new UnionFind(sizeX * sizeY);
    var stop = (sizeX - 2) * (sizeY - 2);
    do {
      // console.log('percolate ' + (sizeX * sizeY - stop) / (sizeX * sizeY));
      var x, y, lightProb, toErase;

      do {
        x = getRandomInt(1, sizeX - 2);
        y = getRandomInt(1, sizeY - 2);
        lightProb = Math.random();
        toErase = this.cell.getRight(x).getUp(y);
      } while (toErase.isEmpty());

      toErase.setEmpty(true);
      toErase.setLight(lightProb > 0.7);

      if (toErase.getUp() && toErase.getUp().isEmpty())
        unionFind.union(x + sizeX * y, x + sizeX * (y + 1));

      if (toErase.getRight() && toErase.getRight().isEmpty())
        unionFind.union(x + sizeX * y, x + sizeX * y + 1);

      if (toErase.getDown() && toErase.getDown().isEmpty())
        unionFind.union(x + sizeX * y, x + sizeX * (y - 1));

      if (toErase.getLeft() && toErase.getLeft().isEmpty())
        unionFind.union(x + sizeX * y, x + sizeX * y - 1);

    } while(!unionFind.connected(startPos, endPos) && --stop);

    this.percolations = ((sizeX - 2) * (sizeY - 2) - stop) / ((sizeX - 2) * (sizeY - 2));

    if (mazeCreator.percolations > 0.9)
      this.difficulty = 'easy';
    else if (mazeCreator.percolations > 0.7)
      this.difficulty = 'normal';
    else if (mazeCreator.percolations > 0.5)
      this.difficulty = 'hard';
    else
      this.difficulty = 'impossible';

    console.log('percolations ' + ((sizeX - 2) * (sizeY - 2) - stop) / ((sizeX - 2) * (sizeY - 2)));
  }

  var time = 0;
  var stepTreshold = 0;
  var drawCell = null, isDrawed = false;

  var H = 2, W = 2, hDir = 1, wDir = -1, i = 0, j = 0;

  this.draw = function () {
    if (!drawCell)
      drawCell = /*this.start.getRight();*/this.cell.getLeftEnd().getDownEnd();

    // draw maze
    if (!drawCell.isEmpty())
      drawCell.content = placeCubeAt(drawCell.x, drawCell.y, 0);
    else if (drawCell.hasLight())
      drawCell.content = placeFloorAt(drawCell.x, drawCell.y, 0);

    // ++i;
    //
    // if (i < H) {
    //   if (hDir > 0)
    //     drawCell = drawCell.getUp();
    //   else
    //     drawCell = drawCell.getDown();
    // } else {
    //   ++j;
    //
    //   if (j < W) {
    //     drawCell = drawCell.getLeft();
    //   } else {
    //     drawCell = drawCell.getLeft();
    //     i = 0;
    //     j = 0;
    //
    //     hDir = hDir > 0 ? -1 : 1;
    //   }
    // }

    var tmp = drawCell.getRight();

    if (tmp) {
      drawCell = tmp;
      return;
    } else {
      tmp = drawCell.getUp();
      if (tmp) {
        drawCell = tmp.getLeftEnd();
      } else {
        isDrawed = true;
        this.draw = function() { return null; };
      }
    }

    return null;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return this;
}
