import '../scss/main.scss';

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    Vector3,
    Color
} from 'three';

let scene, renderer, camera, cube;

const init = () => {
    scene = new Scene();
    scene.background = new Color( 0xffffff );

    camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.set(5, 5, 5);
    camera.lookAt(new Vector3(0, 0, 0));

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild(renderer.domElement);

    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: 0x000000 } );
    cube = new Mesh( geometry, material );
    scene.add( cube );
}

const animate = function (time) {
    requestAnimationFrame( animate );

    cube.position.set(0, Math.sin(time/1000), 0);
    cube.rotation.set(0, Math.sin(time/1000+1), 0);

    renderer.render(scene, camera);
};

window.addEventListener('resize', () => {
	if(camera && renderer) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
});

if( !init() ) animate();