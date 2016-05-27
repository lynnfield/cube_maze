var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 4);
document.body.appendChild( renderer.domElement );


// adding light
var ambientLight = new THREE.AmbientLight( 0x0a0a0a ); // soft white light
scene.add( ambientLight );


// generate maze
var sizeX = 50;
var sizeY = 50;

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
}

console.log('create maze ' + sizeX + 'x' + sizeY);
var mazeCreator = new MazeCreator(sizeX, sizeY);
mazeCreator.generate();
// end generate maze

// generate and place player
var player = new Player(mazeCreator.start);
var playerSphere = placeSphereAt(player.getPosition().x, player.getPosition().y, 0);
playerSphere.lookAt(
  playerSphere.position.clone(
    playerSphere.position.x,
    playerSphere.position.y,
    playerSphere.position.z - 1
  ));
camera.lookAt(playerSphere.position);

var light = new THREE.DirectionalLight( 0xffffff, 0.3 );
scene.add( light );
light.target = playerSphere;

var pointLight = new THREE.PointLight(0xffffff, 1, 5);
scene.add(pointLight);

// draw
var drawer = new Drawer(scene);
drawer.draw(player.cell);

// update
function updatePlayer(deltaTime) {
  deltaTime = deltaTime || 1;
  var destination = new THREE.Vector3(player.getPosition().x, player.getPosition().y, playerSphere.position.z);
  playerSphere.position.lerp(destination, 0.01 * deltaTime);

  pointLight.position.copy(playerSphere.position);
  light.position.copy(playerSphere.position);
  light.position.z += 1;


  camera.quaternion.slerp(playerSphere.quaternion, 0.02 * deltaTime);
  camera.position.x = playerSphere.position.x;
  camera.position.y = playerSphere.position.y;
  camera.position.z = 5;

  if (player.cell == mazeCreator.end)
    location.reload();
}
updatePlayer();

// movement
window.onkeyup = function (event) {
  console.log(event.keyCode);
  switch (event.keyCode) {
    case 37:  // left
      // player.moveLeft()
      player.rotateLeft();
      playerSphere.rotateOnAxis(playerSphere.getWorldDirection(), Math.PI/2);
      break;
    case 38:  // up
      player.moveUp()
      break;
    case 39:  // right
      // player.moveRight();
      player.rotateRight();
      playerSphere.rotateOnAxis(playerSphere.getWorldDirection(), -Math.PI/2);
      break;
    case 40:  // down
      player.moveDown();
      break;
    case 87:  // forward 'a'
      console.log('forward');
      break;
    case 83:  // backward 'b'
      console.log('backward');
      break;
  }

  drawer.draw(player.cell);

  // updatePlayer();
  var from = new THREE.Vector3(mazeCreator.end.x, mazeCreator.end.y, 0);
  var to = new THREE.Vector3(player.cell.x, player.cell.y, 0)
  console.log('distance to end: ' + Math.floor(from.distanceTo(to)) + ' movements: ' + player.successMovements + '/' + player.movements);
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

// create and place cube
function placeCubeAt(x, y, z) {
  if (!placeCubeAt.geometry)
    placeCubeAt.geometry = new THREE.BoxGeometry( 1, 1, 1 );
  if (!placeCubeAt.material)
    placeCubeAt.material = new THREE.MeshStandardMaterial({ color : 0x00C9FF });
  var cube = new THREE.Mesh( placeCubeAt.geometry, placeCubeAt.material );
  cube.position.set(x, y, z);
  // scene.add( cube );
  return cube;
}

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

function placeFloorAt(x, y, z) {
  if (!placeFloorAt.geometry)
    placeFloorAt.geometry = new THREE.PlaneGeometry( 1, 1 );
  if (!placeFloorAt.material)
    placeFloorAt.material = new THREE.MeshStandardMaterial({ color : 0xb600ff });
  var plane = new THREE.Mesh( placeFloorAt.geometry, placeFloorAt.material );
  plane.position.set(x, y, z);
  // scene.add(plane);
  return plane;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ready() {
  var sizeView = document.querySelector('#mazeSize');
  var difficultyView = document.querySelector('#mazeDifficulty');

  sizeView.textContent = 'Size: ' + mazeCreator.sizeX + 'x' + mazeCreator.sizeY;
  difficultyView.textContent = 'Difficulty: ' + mazeCreator.difficulty + ' (percolations: ' + mazeCreator.percolations.toFixed(3) + ')';
}

document.addEventListener("DOMContentLoaded", ready);
