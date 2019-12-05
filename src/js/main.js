// Basic three.js imports
import {
  CameraHelper,
  Clock,
  Color,
  DirectionalLight,
  FogExp2,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';

// Loaders
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';

// Assets
import noise from '../images/noise/luos/T_Random_47.png';
import cactus from '../models/cactus/model.obj';

// Shaders
import TestShaderMaterial from '../js/shaders/TestShaderMaterial';

export default class Main {
  constructor(container) {
    // Define some high level app variables to keep track of
    this.container = container;

    // Assets can be easily referenced from here at any point by name
    this.assets = {
      models: {},
      textures: {},
      audio: {},
      other: {}
    }

    // Move onto asset loading
    this.loadAssets();
  }

  async loadAssets() {
    // Load models, textures, and other assets
    // ...

    // Texture Loader
    this.textureLoader = new TextureLoader();

    // Noise texture
    await new Promise( resolve => {
      this.textureLoader.load( `..${noise}`, (noiseTexture) => {
        console.log(`Loaded: ${noise}`);
        this.assets.textures["noise"] = noiseTexture;
        resolve();
      });
    });

    // .obj Loader
    this.objLoader = new OBJLoader2();

    // Cactus model
    await new Promise( resolve => {
      this.objLoader.load( `..${cactus}`, (cactusModel) => {
        console.log(`Loaded: ${cactus}`);
        this.assets.models["cactus"] = cactusModel;
        resolve();
      });
    });

    // Log all assets
    console.log(this.assets);

    // Move onto scene building
    this.buildScene();
  }

  buildScene() {
    // Create everything that will live in your scene
    // ...

    // Clock
    this.clock = new Clock();
    this.clock.start();

    // Scene
    this.scene = new Scene();
    this.scene.background = new Color( 0xffffff );
    this.scene.fog = new FogExp2(0x000000, 0);
    
    // Camera
    this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(new Vector3(0, 0, 0));

    // Renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    // Directional light
    this.directionalLight = new DirectionalLight(0xf0f0f0, 0.4);
    this.directionalLight.position.set(0, 10, 0);
    this.directionalLight.visible = true;

    // Shadow map
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.bias = 0;
    this.directionalLight.shadow.camera.near = 250;
    this.directionalLight.shadow.camera.far = 400;
    this.directionalLight.shadow.camera.left = -100;
    this.directionalLight.shadow.camera.right = 100;
    this.directionalLight.shadow.camera.top = 100;
    this.directionalLight.shadow.camera.bottom = -100;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;

    // Shadow camera helper
    this.directionalLightHelper = new CameraHelper(this.directionalLight.shadow.camera);
    this.directionalLightHelper.visible = true;

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLightHelper);

    // Objects
    const geometry = new SphereGeometry( 1, 20, 20 );
    const material = new TestShaderMaterial({ noise: this.assets.textures["noise"] });
    this.sphere = new Mesh( geometry, material );
    this.scene.add( this.sphere );

    // Window resize event listener
    window.addEventListener('resize', () => {
      if(this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
      }
    });
    
    // Move onto rendering
    this.render();
  }

  render() {
    // Animation stuff and other changes that take place every frame
    // ...

    // Update time
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Update sphere
    this.sphere.position.set(0, Math.sin(elapsedTime), 0);
    this.sphere.rotation.set(0, Math.sin(elapsedTime+1), 0);

    // Update controls
    this.controls.update();

    // Render after all scene updates
    this.renderer.render(this.scene, this.camera);
    
    // RAF
    // Bind the main class instead of window object, DOUBLE CHECK THAT THIS IS A THING
    requestAnimationFrame(this.render.bind(this));
  }
}
