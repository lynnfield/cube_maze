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

if (mazeCreator.percolations > 0.9)
  console.log('i think this one is easy');
else if (mazeCreator.percolations > 0.7)
  console.log('i think this one is normal');
else if (mazeCreator.percolations > 0.5)
  console.log('i think this one is hard');
else
  console.log('i think this one is impossible');


// generate and place player
var player = new Player(mazeCreator.start);
var playerSphere = placeSphereAt(player.getPosition().x, player.getPosition().y, 0);

var light = new THREE.DirectionalLight( 0xffffff, 0.3 );
scene.add( light );
light.target = playerSphere;

var pointLight = new THREE.PointLight(0xffffff, 1, 5);
scene.add(pointLight);

// update
function updatePlayer(deltaTime) {
  deltaTime = deltaTime || 1;
  var destination = new THREE.Vector3(player.getPosition().x, player.getPosition().y, playerSphere.position.z);
  playerSphere.position.lerp(destination, 0.01 * deltaTime);

  pointLight.position.copy(playerSphere.position);
  light.position.copy(playerSphere.position);
  light.position.z += 1;

  camera.position.x = playerSphere.position.x;
  camera.position.y  = playerSphere.position.y;
  camera.position.z = 5;
  camera.lookAt(playerSphere.position);

  if (player.cell == mazeCreator.end)
    location.reload();
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
  var from = new THREE.Vector3(mazeCreator.end.x, mazeCreator.end.y, 0);
  var to = new THREE.Vector3(player.cell.x, player.cell.y, 0)
  console.log('distance to end: ' + from.distanceTo(to) + ' movements: ' + player.successMovements + '/' + player.movements);
}

function update(deltaTime) {
  // console.log(player.getPosition());
  updatePlayer(deltaTime);
  mazeCreator.draw(deltaTime);
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
  var material = new THREE.MeshStandardMaterial({
    color : 0x00C8FF
  });
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set(x, y, z);
  scene.add( cube );
  return cube;
}

// create and place spere
function placeSphereAt(x, y, z) {
  var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
  var material = new THREE.MeshStandardMaterial({ color : 0x49FF00 });
  var sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(x, y, z);
  scene.add( sphere );
  return sphere;
}

function placeFloorAt(x, y, z) {
  var geometry = new THREE.PlaneGeometry( 1, 1 );
  var material = new THREE.MeshStandardMaterial({ color : 0xb600ff });
  var plane = new THREE.Mesh( geometry, material );
  plane.position.set(x, y, z);
  scene.add( plane );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
