import { 
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    Vector3
} from 'three';

let scene, renderer, camera, cube;

let building = {
    object: undefined,
    position: undefined,
    target: new Vector3(0, 0, 0),
    acceleration: new Vector3(0, 0, 0),
    velocity: new Vector3(0, 0, 0),
    damping: new Vector3(0.5, 0.5, 0.5)
}

const init = () => {
    scene = new Scene();
    camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    renderer = new WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild(renderer.domElement);

    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 30;

    building.object = cube;
    building.position = cube.position;
}

function setBuildingProps () {
    building.target.set(
        Math.floor(Math.random()*20-10),
        Math.floor(Math.random()*20-10),
        0
    );
    // building.position.set(
    //     Math.floor(Math.random()*20-10),
    //     Math.floor(Math.random()*20-10),
    //     0
    // );

    // building.rotation.x = Math.floor(Math.random() * 40 - 20);
    // building.rotation.y = Math.floor(Math.random() * 30 - 15);
}

const updateBuildingProps = () => {
    if(building.position.x != building.target.x || building.position.y != building.target.y || building.position.z != building.target.z) {
        building.acceleration.set(
            (building.target.x - building.position.x)*0.5,
            (building.target.y - building.position.y)*0.5,
            (building.target.z - building.position.z)*0.5
        );
        building.velocity.set(
            (building.velocity.x + building.acceleration.x)*building.damping.x,
            (building.velocity.y + building.acceleration.y)*building.damping.y,
            (building.velocity.z + building.acceleration.z)*building.damping.y
        );
        building.position.set(
            building.position.x + building.velocity.x,
            building.position.y + building.velocity.y,
            building.position.z + building.velocity.z
        );

        if(building.position.distanceTo(building.target) < 0.001/* && building.acceleration.x < 0.01*/) {
            building.position.set(
                building.target.x,
                building.target.y,
                building.target.z
            );
        }
    }
}

const animate = function () {
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    updateBuildingProps();

    renderer.render(scene, camera);
};

window.addEventListener('mousedown', () => {
    // console.log("Cube is at: " + cube.position.x + ", " + cube.position.y + ", " + cube.position.z);
    // console.log(building);
    setBuildingProps();
});

window.addEventListener('resize', () => {
	if(camera && renderer) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
});

if( !init() ) animate();