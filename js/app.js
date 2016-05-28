var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 4);
document.body.appendChild( renderer.domElement );


// adding light
var ambientLight = new THREE.AmbientLight( 0x0a0a0a ); // soft white light
scene.add( ambientLight );


// generate maze
var sizeX = 5;
var sizeY = 5;
var sizeZ = 5;

var params = location.search.replace('?', '');
params = params.split('&');
for (var index in params) {
  var keyval = params[index].split('=');
  if (keyval[0].includes('sizex')) {
    var tmp = parseInt(keyval[1]);
    if (!isNaN(tmp))
      sizeX = tmp;
  }
  if (keyval[0].includes('sizey')) {
    var tmp = parseInt(keyval[1]);
    if (!isNaN(tmp))
      sizeY = tmp;
  }
  if (keyval[0].includes('sizez')) {
    var tmp = parseInt(keyval[1]);
    if (!isNaN(tmp))
      sizeZ = tmp;
  }
}

console.log('create maze ' + sizeX + 'x' + sizeY + 'x' + sizeZ);
var mazeCreator = new MazeCreator(sizeX, sizeY, sizeZ);
mazeCreator.generate();

var startMesh = new THREE.Mesh(
  new THREE.BoxGeometry( 1, 1, 1 ),
  new THREE.MeshStandardMaterial({
    color : 0x49FF00,
    transparent : true,
    opacity : 0.5
  }));
var endMesh = new THREE.Mesh(
  new THREE.BoxGeometry( 1, 1, 1 ),
  new THREE.MeshStandardMaterial({
    color : 0xFF3600,
    transparent : true,
    opacity : 0.5
  }));
startMesh.position.set(mazeCreator.start.x, mazeCreator.start.y, mazeCreator.start.z);
endMesh.position.set(mazeCreator.end.x, mazeCreator.end.y, mazeCreator.end.z);
scene.add(startMesh, endMesh);
// end generate maze


var light = new THREE.DirectionalLight( 0xffffff, 0.3 );
// scene.add( light );

var pointLight = new THREE.PointLight(0xffffff, 1, 5);
// scene.add(pointLight);

// generate and place player
var player = new Player(mazeCreator.start);
var playerSphere = placeSphereAt(player.getPosition().x, player.getPosition().y, player.getPosition().z);
// camera.position.set(0,0,0);
playerSphere.add(camera, light, pointLight);

light.target = playerSphere;
light.translateZ(2);
camera.translateZ(5);

// playerSphere.rotateOnAxis(playerSphere.up, Math.PI);

// draw
var drawer = new Drawer(scene);
drawer.draw(player);

var targetRotation = new THREE.Object3D();

// update
function updatePlayer(deltaTime) {
  deltaTime = deltaTime || 1;
  var destination = new THREE.Vector3(player.getPosition().x, player.getPosition().y, player.getPosition().z);
  playerSphere.position.lerp(destination, 0.01 * deltaTime);
  playerSphere.quaternion.slerp(targetRotation.quaternion, 0.01 * deltaTime);

  // pointLight.position.copy(playerSphere.position);
  // light.position.copy(playerSphere.position);
  // light.position.z += 1;

  // camera.position.copy(playerSphere.position);
  // camera.quaternion.slerp(playerSphere.quaternion, 0.02 * deltaTime);
  // camera.position.x = playerSphere.position.x;
  // camera.position.y = playerSphere.position.y;
  // camera.position.z = playerSphere.position.z + 5;

  if (player.cell == mazeCreator.end) {
    window.location.reload();
    window.location.reload();
  }
}
updatePlayer();

var xAxis = new THREE.Vector3(1,0,0);
var zAxis = new THREE.Vector3(0,0,1);

// movement
window.onkeyup = function (event) {
  switch (event.keyCode) {
    case 37:  // left
      player.rotateLeft();
      targetRotation.rotateOnAxis(zAxis, Math.PI/2);
      // playerSphere.rotateOnAxis(zAxis, Math.PI/2);
      break;
    case 38:  // up
      player.moveUp()
      break;
    case 39:  // right
      player.rotateRight();
      targetRotation.rotateOnAxis(zAxis, -Math.PI/2);
      // playerSphere.rotateOnAxis(zAxis, -Math.PI/2);
      break;
    case 40:  // down
      player.moveDown();
      break;
    case 87:  // forward 'a'
      player.rotateForward();
      targetRotation.rotateOnAxis(xAxis, -Math.PI/2);
      // playerSphere.rotateOnAxis(xAxis, -Math.PI/2);
      break;
    case 83:  // backward 'b'
      player.rotateBackward();
      targetRotation.rotateOnAxis(xAxis, Math.PI/2);
      // playerSphere.rotateOnAxis(xAxis, Math.PI/2);
      break;
  }

  drawer.draw(player);

  // updatePlayer();
  var from = new THREE.Vector3(mazeCreator.end.x, mazeCreator.end.y, mazeCreator.end.z);
  var to = new THREE.Vector3(player.cell.x, player.cell.y, player.cell.z);
  console.log('distance to end: ' + Math.floor(from.distanceTo(to)) + ' movements: ' + player.successMovements + '/' + player.movements);

  document.querySelector('#distanceToEnd').textContent = 'Distance to end: ' + Math.floor(from.distanceTo(to));
}

function update(deltaTime) {
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

// create and place spere
function placeSphereAt(x, y, z) {
  if (!placeSphereAt.geometry)
    placeSphereAt.geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
  if (!placeSphereAt.material)
    placeSphereAt.material = new THREE.MeshStandardMaterial({ color : 0x49FF00 });
  var sphere = new THREE.Mesh( placeSphereAt.geometry, placeSphereAt.material );
  sphere.position.set(x, y, z);
  scene.add( sphere );
  return sphere;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ready() {
  var sizeView = document.querySelector('#mazeSize');

  sizeView.textContent = 'Size: ' + mazeCreator.sizeX + 'x' + mazeCreator.sizeY + 'x' + mazeCreator.sizeZ;
  // difficultyView.textContent = 'Difficulty: ' + mazeCreator.difficulty + ' (percolations: ' + mazeCreator.percolations.toFixed(3) + ')';
}

document.addEventListener("DOMContentLoaded", ready);
