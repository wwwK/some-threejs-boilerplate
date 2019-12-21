export default class OutlinePass {
  constructor(uniforms) {
    this.vertexShader = `
      varying vec2 vUv;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        vUv = uv;

        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    this.fragmentShader = `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;

      void main() {
        // Invert colors
        gl_FragColor = 1.0 - texture2D(tDiffuse, vUv);


        // Previous pass - debug
        // gl_FragColor = texture2D(tDiffuse, vUv);
      }
    `;

    this.uniforms = {
      ...uniforms,
      tDiffuse: { type: 't', value: null }
    };
  }
}
