var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight - 4);
document.body.appendChild(renderer.domElement);

// adding light
var ambientLight = new THREE.AmbientLight(0x0a0a0a); // soft white light
scene.add(ambientLight);

// parse maze size
var paramsParser = new ParamsParser({
    defaultX: 5,
    defaultY: 5,
    defaultZ: 5
});

// generate maze
var mazeCreator = new MazeCreator(paramsParser.sizeX, paramsParser.sizeY, paramsParser.sizeZ);
mazeCreator.generate();

// add start & end boxes
var standardBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
var startMesh = new THREE.Mesh(
    standardBoxGeometry,
    new THREE.MeshStandardMaterial({
        color: 0x49FF00,
        transparent: true,
        opacity: 0.5
    }));
var endMesh = new THREE.Mesh(
    standardBoxGeometry,
    new THREE.MeshStandardMaterial({
        color: 0xFF3600,
        transparent: true,
        opacity: 0.5
    }));
startMesh.position.copy(mazeCreator.start);
endMesh.position.copy(mazeCreator.end);
scene.add(startMesh, endMesh);

// create lights
var light = new THREE.DirectionalLight(0xffffff, 0.3);
var pointLight = new THREE.PointLight(0xffffff, 1, 5);


var thirdPersonViewCameraPosition = new THREE.Object3D();
var firstPersonViewCameraPosition = new THREE.Object3D();

// generate and place player
var player = new Player(mazeCreator.start);
var playerSphere = placeSphereAt(player.getPosition());
playerSphere.add(camera, light, pointLight, firstPersonViewCameraPosition, thirdPersonViewCameraPosition);

// configure lights
light.target = playerSphere;
light.translateZ(2);

// configure camera
firstPersonViewCameraPosition.rotateX(Math.PI / 2);
thirdPersonViewCameraPosition.translateZ(5);
var currentCameraPosition = thirdPersonViewCameraPosition;

// draw
var drawer = new Drawer(scene);
drawer.draw(player);

var targetRotation = new THREE.Object3D();

// update
var reloading = false;
function lerp(from, to, delta) {
    if (Math.abs(from.distanceTo(to)) > 0.01)
        from.lerp(to, delta);
    else
        from.copy(to);
}
function slerp(from, to, delta) {
    from.slerp(to, delta);
}
function updatePlayer(deltaTime) {
    deltaTime = deltaTime || 1;

    var step = 0.01 * deltaTime;

    lerp(playerSphere.position, player.getPosition(), step);
    slerp(playerSphere.quaternion, targetRotation.quaternion, step);

    lerp(camera.position, currentCameraPosition.position, step);
    slerp(camera.quaternion, currentCameraPosition.quaternion, step);

    if (player.cell == mazeCreator.end) {
        if (!reloading) {
            reloading = true;
            console.log('win');
            window.location.reload();
        }
    }
}
updatePlayer();

// movement
function onRotateBackward() {
    player.rotateBackward();
    targetRotation.rotateX(Math.PI / 2);
    drawer.draw(player);
}
function onRotateForward() {
    player.rotateForward();
    targetRotation.rotateX(-Math.PI / 2);
    drawer.draw(player);
}
function onRotateLeft() {
    player.rotateLeft();
    targetRotation.rotateZ(Math.PI / 2);
    drawer.draw(player);
}
function onRotateRight() {
    player.rotateRight();
    targetRotation.rotateZ(-Math.PI / 2);
    drawer.draw(player);
}
function onMoveUp() {
    player.moveUp();
    drawer.draw(player);
}
addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 37:  // left
            onRotateLeft();
            break;
        case 38:  // up
            onMoveUp();
            break;
        case 39:  // right
            onRotateRight();
            break;
        case 40:  // down
            player.moveDown();
            drawer.draw(player);
            break;
        case 87:  // forward 'w'
            onRotateForward();
            break;
        case 83:  // backward 's'
            onRotateBackward();
            break;
        case 65: // roll left 'a'
            player.rollLeft();
            targetRotation.rotateY(-Math.PI / 2);
            drawer.draw(player);
            break;
        case 68: // roll right 'd'
            player.rollRight();
            targetRotation.rotateY(Math.PI / 2);
            drawer.draw(player);
            break;
        case 67: // camera 'c'
            if (currentCameraPosition == firstPersonViewCameraPosition)
                currentCameraPosition = thirdPersonViewCameraPosition;
            else
                currentCameraPosition = firstPersonViewCameraPosition;
            break;
    }

    var from = mazeCreator.end;
    var to = player.cell;

    document.querySelector('#distanceToEnd').textContent = 'Distance to end: ' + Math.floor(from.distanceTo(to));
});

var inDragMode = false;
var downPosition = {x: 0, y: 0};

addEventListener('mousedown', function (e) {
    downPosition.x = e.x;
    downPosition.y = e.y;
});

addEventListener('mousemove', function (e) {
    inDragMode = e.buttons == 1 && e.button == 0;
    // if (inDragMode) {
    //     var x = e.x - downPosition.x;
    //     var z = e.y - downPosition.y;
    //     console.log('('+x+';'+z+')');
    // }
});

addEventListener('mouseup', function(e) {
    if (inDragMode) {
        var x = e.x - downPosition.x;
        var y = e.y - downPosition.y;

        if (Math.abs(x) > Math.abs(y)) {
            if (x > 0)
                onRotateLeft();
            else
                onRotateRight();
        } else {
            if (y > 0)
                onRotateForward();
            else
                onRotateBackward();
        }
    }
});

addEventListener('click', function () {
    if (!inDragMode)
        onMoveUp();
});


// resize window
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight - 4 );
}

// update
function update(deltaTime) {
    updatePlayer(deltaTime);
}

// request renderer
function render(time) {
    var delta = time - render.prevTime;
    render.prevTime = time;

    requestAnimationFrame(render);

    update(delta);

    renderer.render(scene, camera);
}
render.prevTime = 0;
render(0);

renderer.render(scene, camera);

// create and place spere
function placeSphereAt(pos) {
    if (!placeSphereAt.geometry)
        placeSphereAt.geometry = new THREE.SphereGeometry(0.5, 16, 16);
    if (!placeSphereAt.material)
        placeSphereAt.material = new THREE.MeshStandardMaterial({color: 0x49FF00});
    var sphere = new THREE.Mesh(placeSphereAt.geometry, placeSphereAt.material);
    sphere.position.copy(pos);
    scene.add(sphere);
    return sphere;
}

function ready() {
    document.querySelector('#mazeSize').textContent =
        'Size: ' + mazeCreator.sizeX + 'x' + mazeCreator.sizeY + 'x' + mazeCreator.sizeZ;
}

document.addEventListener("DOMContentLoaded", ready);
