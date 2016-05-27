
function GrowingPool(objectCreator) {
  var index = 0;
  var objects = [];

  this.get = function() {
    var ret = objects[index];
    if (!ret)
      ret = objects[index] = objectCreator();
    ++index;
    return ret;
  }

  this.reset = function() {
    index = 0;
  }
}

function Drawer(scene) {
  var cubePool  = new GrowingPool(function () { return placeCubeAt(0,0,0); });
  var floorPool = new GrowingPool(function () { return placeFloorAt(0,0,0); });

  var drawObjects = [];

  function addToVisible(cell) {
    if (!cell) return;

    var obj = cell.isEmpty() ? floorPool.get() : cubePool.get();

    obj.position.set(cell.x, cell.y, 0);
    drawObjects.push(obj);
  }

  function resetVisible() {
    if (drawObjects.length > 0) {
      scene.remove.apply(scene, drawObjects);
      drawObjects = [];
      cubePool.reset();
      floorPool.reset();
    }
  }

  function drawVisible() {
    if (drawObjects.length > 0)
      scene.add.apply(scene, drawObjects);
  }

  function addToVisibleWithNeighbours(cell, radius) {
    if (cell) {
      addToVisible(cell);
      for (var i = 0; i < radius; ++ i) {
        addToVisible(cell.getUp(i + 1));
        addToVisible(cell.getDown(i + 1));
      }
    }
  }

  this.draw = function (pivot, width, height) {
    height = height || 11;
    width = width || 11;

    resetVisible();

    addToVisibleWithNeighbours(pivot, height);
    for (var i = 0; i < width; ++ i) {
      addToVisibleWithNeighbours(pivot.getLeft(i + 1), height);
      addToVisibleWithNeighbours(pivot.getRight(i + 1), height);
    }

    drawVisible();
  }

  return this;
}
