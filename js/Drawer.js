
function Drawer(scene) {
    var cubePool = new GrowingPool(cubeGenerator());
    var halfVisibleCubePool = new GrowingPool(halfVisibleCubeGenerator());
    var floorPool = new GrowingPool(floorGenerator());

    var drawObjects = [];

    function addToVisible(cell) {
        if (!cell || cell.isEmpty()) return;

        var obj = cubePool.get();

        obj.position.copy(cell);
        drawObjects.push(obj);
    }

    function addToHalfVisible(cell) {
        if (!cell || cell.isEmpty()) return;

        var obj = halfVisibleCubePool.get();

        obj.position.copy(cell);
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

    function addToVisibleWithNeighbours(player, cell, radius) {
        if (cell) {
            addToVisible(cell);
            for (var i = 0; i < radius; ++i) {
                addToVisible(player.getUp(cell, i + 1));
                addToVisible(player.getDown(cell, i + 1));
            }
        }
    }

    function addToHalfVisibleWithNeighbours(player, cell, radius) {
        if (cell) {
            addToHalfVisible(cell);
            for (var i = 0; i < radius; ++i) {
                addToHalfVisible(player.getUp(cell, i + 1));
                addToHalfVisible(player.getDown(cell, i + 1));
            }
        }
    }

    this.draw = function (player, width, height, length) {
        height = height || 11;
        width = width || 11;
        length = length || 11;
        var item, i;

        resetVisible();

        // draw player level
        addToVisibleWithNeighbours(player, player.cell, height);
        for (i = 0; i < width; ++i) {
            addToVisibleWithNeighbours(player, player.getLeft(player.cell, i + 1), height);
            addToVisibleWithNeighbours(player, player.getRight(player.cell, i + 1), height);
        }

        // draw down layers
        for (var j = 0; j < length; ++j) {
            item = player.getForward(player.cell, j + 1);
            if (item) {
                addToVisibleWithNeighbours(player, item, height);
                for (i = 0; i < width; ++i) {
                    addToVisibleWithNeighbours(player, player.getLeft(item, i + 1), height);
                    addToVisibleWithNeighbours(player, player.getRight(item, i + 1), height);
                }
            }
        }

        // draw upper level
        item = player.getBackward(player.cell);
        if (item) {
            addToHalfVisibleWithNeighbours(player, item, height);
            for (i = 0; i < width; ++i) {
                addToHalfVisibleWithNeighbours(player, player.getLeft(item, i + 1), height);
                addToHalfVisibleWithNeighbours(player, player.getRight(item, i + 1), height);
            }
        }

        drawVisible();
    };

    return this;
}

function GrowingPool(objectCreator) {
    var index = 0;
    var objects = [];

    this.get = function () {
        var ret = objects[index];
        if (!ret)
            ret = objects[index] = objectCreator();
        ++index;
        return ret;
    };

    this.reset = function () {
        index = 0;
    }
}

var loader = new THREE.CubeTextureLoader();
loader.setPath('textures/cube/');

var textureCube = loader.load([
    'x.png', 'x.png',
    'y.png', 'y.png',
    'z.png', 'z.png'
]);

function cubeGenerator() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        envMap: textureCube
    });
    return function () {
        return new THREE.Mesh(geometry, material);
    }
}

function halfVisibleCubeGenerator() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        envMap: textureCube
    });
    return function () {
        return new THREE.Mesh(geometry, material);
    }
}

function floorGenerator() {
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshStandardMaterial({color: 0xb600ff});
    return function () {
        return new THREE.Mesh(geometry, material);
    }
}