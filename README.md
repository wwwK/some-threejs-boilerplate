# Some ThreeJS Boilerplate
Minimal ThreeJS Boilerplate for rapid 3D development. Includes:

- three.js
- webpack-dev-server

## Preface

This boilerplate was intended to help jumpstart and maintain excitement for prototyping cool ideas. It includes some opinionated essentials to help skip some of the more convoluted setup in three.js.

The list of essentials includes:

- Basic scene structure
- Texture/model loaders
- Orbit controls
- Lighting
- Shadows
- Custom material shader
- Custom post-processing shader

## Getting Started

Webpack entry point in `/src/app.js`

`$ npm i` to install modules

`$ npm start` to create a dev build hosted locally at `http://localhost:3000/`

`$ npm run build` to create a production-ready build under `/dist`

## Structure

### File structure

<span style="color:blue">src/</span>
<br>&nbsp;&nbsp;|- <span style="color:red">app.js</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">js/</span>
<br>&nbsp;&nbsp;&nbsp;&nbsp;|- <span style="color:red">main.js</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">scss/</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">html/</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">audio/</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">fonts/</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">images/</span>
<br>&nbsp;&nbsp;|- <span style="color:blue">models/</span>

<span style="color:red">app.js</span> is the webpack entry point reserved for compatibility checks and any other processes that take place **before** the three.js scene is initialized.

<span style="color:red">main.js</span> is where all of our three.js lives.

### main.js workflow

#### 1. constructor(container)
The <span style="color:red">main</span> class is instantiated in <span style="color:red">app.js</span> and takes only one argument, the canvas DOM element we'd like to render to. This constructor also defines some higher-level variables such as the resolution of our container and an assets object that hold references for anything we're loading in such as models, textures, and audio.

#### 2. loadAssets()
This function handles the loading of any external assets. The asyncronous loading processes are preceded with await to ensure that everything is loaded and ready to be used before moving on. 

#### 3. buildScene()
Our scene is built here. Everything from the scene itself, to the objects that live in it, to the render passes is defined here.

#### 4. update()
Anything that changes over time lives here such as object transformations, clock updates, and rendering.

## Shaders

### Custom Material Shaders

To create custom material shaders, you can use the template in `src/js/shaders/CustomShaderMaterial.js`

The class extends the ShaderMaterial class of three.js and has all the properties that come with a ShaderMaterial, including the vertex shader, fragment shader, and uniforms defined in the class.

Here is how to instantiate a custom material shader in main.js:

```
// Import
import CustomShaderMaterial from './shaders/CustomShaderMaterial';

// Then instantiate
this.customShaderMaterial = new CustomShaderMaterial();
```

### Custom Post-Processing Shaders

To create custom post-processing shaders, you can use the template in `src/js/shaders/CustomShaderPass.js`

This class **does not** extend the ShaderPass class of three.js, and instead is passed in its constructor.


Here is how to instantiate a custom post-processing shader in main.js:

```
// Import
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import CustomShaderPass from './shaders/CustomShaderPass';

// Then instantiate
this.customShaderPass = new ShaderPass(new CustomShaderPass());
```
