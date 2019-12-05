import { ShaderMaterial } from "three";

export default class TestShaderMaterial extends ShaderMaterial {
  constructor(uniforms) {
    super({
      vertexShader: `
        uniform sampler2D _noise;
        // varying vec3 _vNormal;

        void main() {
          // _vNormal = normal;

          float noiseOffset = texture2D(_noise, uv).r;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal * noiseOffset, 1.0 );
        }
      `,
      fragmentShader: `
      // varying vec3 _vNormal;

        void main() {
          // float outlineable = dot(_vNormal);
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `
    });

    this.uniforms = {
      _noise:  { value: uniforms.noise },
    };
  }
}
