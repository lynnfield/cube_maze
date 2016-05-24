var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// adding light
var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 1, 2, 3 );
scene.add( light );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


// adding box

// fill maze
var sizeX = 50;
var sizeY = 50;
var cell = null, left = null, up = null;
for (var i = 0; i < sizeY; ++i) {
  for (var j = 0; j < sizeX; ++j) {
    cell = new Cell(0, 0);
    if (left)
      left.setRight(cell);
    left = cell;
    if (up) {
      up.setUp(cell);
      up = up.getRight();
    }
    cell.setType(1);
  }
  left = null;
  up = cell.getLeftEnd();
}
cell = cell.getDownEnd().getLeftEnd();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// select random start & end
var start = cell.getRight(getRandomInt(1, sizeX - 2));
var end = cell.getUpEnd().getRight(getRandomInt(1, sizeX - 2));
start.setType(0);
end.setType(0);

// generate maze
var startPos = start.x + sizeX * start.y;
var endPos = end.x + sizeX * end.y;
var unionFind = new UnionFind(sizeX * sizeY);
var stop = sizeX * sizeY;
do {
  console.log('progress ' + (sizeX * sizeY - stop) / (sizeX * sizeY));
  var x, y, toErase;

  do {
    x = getRandomInt(1, sizeX - 2);
    y = getRandomInt(1, sizeX - 2);
    toErase = cell.getRight(x).getUp(y);
  } while (toErase.getType() == 0);

  toErase.setType(0);

  if (toErase.getUp() && toErase.getUp().getType() == 0)
    unionFind.union(x + sizeX * y, x + sizeX * (y + 1));

  if (toErase.getRight() && toErase.getRight().getType() == 0)
    unionFind.union(x + sizeX * y, x + sizeX * y + 1);

  if (toErase.getDown() && toErase.getDown().getType() == 0)
    unionFind.union(x + sizeX * y, x + sizeX * (y - 1));

  if (toErase.getLeft() && toErase.getLeft().getType() == 0)
    unionFind.union(x + sizeX * y, x + sizeX * y - 1);

} while(!unionFind.connected(startPos, endPos) && --stop);


var player = new Player(start);
var playerSphere = placeSphereAt(player.getPosition().x, player.getPosition().y, 0);


// draw maze
while(cell) {
  for (var tmp = cell.getLeftEnd(); tmp; tmp = tmp.getRight()) {
    switch (tmp.getType()) {
      case 0: break;
      case 1: placeCubeAt(tmp.x, tmp.y, 0); break;
    }
  }
  cell = cell.getUp();
}

// update
function updatePlayer(deltaTime) {
  deltaTime = deltaTime || 1;
  var destination = new THREE.Vector3(player.getPosition().x, player.getPosition().y, playerSphere.position.z);
  playerSphere.position.lerp(destination, 0.01 * deltaTime);

  camera.position.x = playerSphere.position.x;
  camera.position.y  = playerSphere.position.y;
  camera.position.z = 5;
  camera.lookAt(playerSphere.position);

  if (player.cell == end)
    console.log('win');
}
updatePlayer();

// movement
window.onkeyup = function (event) {
  switch (event.keyCode) {
    case 37:  // left
      console.log('left');
      player.moveLeft()
      break;
    case 38:  // up
      console.log('up');
      player.moveUp()
      break;
    case 39:  // right
      console.log('right')
      player.moveRight();
      break;
    case 40:  // down
      console.log('down');
      player.moveDown();
      break;
    case 87:  // forward
      console.log('forward');
      break;
    case 83:  // backward
      console.log('backward');
      break;
  }
  // updatePlayer();
  console.log('movements: ' + player.successMovements + '/' + player.movements);
}

function update(deltaTime) {
  // console.log(player.getPosition());
  updatePlayer(deltaTime);
}

// request renderer
function render(time) {
  var delta = time - render.prevTime;
  render.prevTime = time;

	requestAnimationFrame( render );

  update(delta);

	renderer.render( scene, camera );
}
render.prevTime = 0;
render(0);

renderer.render( scene, camera );

// create and place cube
function placeCubeAt(x, y, z) {
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshLambertMaterial( { color : 0x0000ff } );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;
  scene.add( cube );
  return cube;
}

// create and place spere
function placeSphereAt(x, y, z) {
  var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
  var material = new THREE.MeshLambertMaterial( { color : 0x00ff00 } );
  var sphere = new THREE.Mesh( geometry, material );
  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
  scene.add( sphere );
  return sphere;
}
