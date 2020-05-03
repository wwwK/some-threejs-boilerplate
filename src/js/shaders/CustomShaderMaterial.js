import { ShaderMaterial } from "three";

export default class CustomShaderMaterial extends ShaderMaterial {
  constructor(uniforms) {
    super({
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
    });

    this.uniforms = { ...uniforms };
  }
}
