// Css imports
import '../scss/main.scss';

// Basic three.js imports
import {
  AmbientLight,
  BoxBufferGeometry,
  CameraHelper,
  Clock,
  Color,
  DirectionalLight,
  FogExp2,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

// Loaders
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';

// Assets
import noise from '../images/noise/luos/T_Random_47.png';
import cactus from '../models/cactus/model.obj';

// Postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// Custom Shaders
import TestShaderMaterial from './shaders/TestShaderMaterial';
import TestShaderPass from './shaders/TestShaderPass';

export default class Main {
  constructor(container) {
    // Define some high level app variables to keep track of
    this.container = container;
    this.resolution = new Vector2(this.container.clientWidth, this.container.clientHeight);
    
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
    // this.scene.background = new Color( 0x000000 );
    this.scene.fog = new FogExp2(0x000000, 0);
    
    // Camera
    this.camera = new PerspectiveCamera( 40, this.resolution.width / this.resolution.height, 10, 200 );
    this.camera.position.set(50, 50, 50);

    // Renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize( this.resolution.width, this.resolution.height );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.shadowSide = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.target = new Vector3(0, 0, 0);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;

    // Ambient light
    this.ambientLight = new AmbientLight(0xffffff, 0.4);
    this.ambientLight.visible = true;

    // Directional light
    this.directionalLight = new DirectionalLight(0xffffff, 1.0);
    this.directionalLight.position.set(-10, 17.5, 10);
    this.directionalLight.visible = true;

    // Shadow settings
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.bias =  -0.0001;
    // this.directionalLight.shadow.camera.near = 250;
    // this.directionalLight.shadow.camera.far = 3500;
    this.directionalLight.shadow.camera.left = -100;
    this.directionalLight.shadow.camera.right = 100;
    this.directionalLight.shadow.camera.top = 100;
    this.directionalLight.shadow.camera.bottom = -100;
    this.directionalLight.shadow.mapSize.width = 2048*4;
    this.directionalLight.shadow.mapSize.height = 2048*4;

    // Shadow camera helper
    this.directionalLightHelper = new CameraHelper(this.directionalLight.shadow.camera);
    this.directionalLightHelper.visible = true;

    // this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
    // this.scene.add(this.directionalLightHelper);

    // Objects
    this.testShaderMaterial = new TestShaderMaterial();

    this.floorGeo = new PlaneBufferGeometry(6, 6);
    this.floor = new Mesh(this.floorGeo);
    this.floor.position.set(0, 0, 0);
    this.floor.rotation.x = -((Math.PI * 90) / 180);
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);

    this.boxGeo = new BoxBufferGeometry(10, 10, 10);
    this.box = new Mesh(this.boxGeo);
    this.box.castShadow = true;
    this.box.receiveShadow = true;
    
    this.scene.add(this.box);

    // Post Processing
    this.composer = new EffectComposer(this.renderer);

    // First, base pass
    this.basePass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.basePass);
    
    // Edge detection pass
    this.testShaderPass = new ShaderPass(new TestShaderPass());  
    this.composer.addPass(this.testShaderPass);

    // Window resize event listeners
    window.addEventListener('resize', () => {
      if(this.camera && this.renderer) {
        this.resolution = new Vector2(this.container.clientWidth, this.container.clientHeight);

        this.camera.aspect = this.resolution.width / this.resolution.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.resolution.width, this.resolution.height);
        this.composer.setSize(this.resolution.width, this.resolution.height);

        this.edgeDetectionPass.uniforms.iResolution.value = this.resolution;
        this.shadowAndDepthBuffer.setSize(this.resolution.width, this.resolution.height);
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

    // Update controls
    this.controls.update();

    // Update objects
    this.box.position.y = 10 + Math.sin(elapsedTime);
    this.box.rotation.x = elapsedTime;
    this.box.rotation.y = elapsedTime;

    // Render after all scene updates
    this.composer.render();

    // RAF and do it all again baby
    requestAnimationFrame(this.render.bind(this));
  }
}
