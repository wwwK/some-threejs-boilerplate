// Dependencies
import { WEBGL } from './js/utils/detector';
import Main from './js/main';

// Styles
import './scss/main.scss';

(function init() {
  // Check for WebGL
  if(!WEBGL.isWebGLAvailable()) {
    Detector.addGetWebGLMessage();
  } else {
    const container = document.getElementById('container');
    new Main(container);
  }
})();
