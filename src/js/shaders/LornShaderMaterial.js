import { ShaderMaterial, Vector3, UniformsUtils, UniformsLib } from "three";

export default class LornShaderMaterial extends ShaderMaterial {
  constructor(uniforms) {
    super({
      vertexShader: `
        uniform sampler2D _noise;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        precision highp float;
  
        varying vec3 vObjPos;
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        
        #if MAX_POINT_LIGHTS &gt; 0
          uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
          uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
          uniform float pointLightDistance[MAX_POINT_LIGHTS];
        #endif
        
        #if MAX_DIR_LIGHTS &gt; 0
          uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];
          uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];
        #endif
        
        uniform vec3 ambientLightColor;
        uniform vec3 _baseColor;
      
        // Random function
        float rand(vec3 v) {
          return 0.5 + 0.5 * fract(sin(dot(v.xyz, vec3(12.9898, 78.233, 98.764))) * 43758.5453);
        }

        void main() {
          vec4 sumLights = vec4(0.0, 0.0, 0.0, 1.0);

          //point lights
          vec4 sumPointLights = vec4(0.0, 0.0, 0.0, 1.0);
          #if MAX_POINT_LIGHTS &gt; 0
          for(int i = 0; i &lt; MAX_POINT_LIGHTS; i++) { 
            vec3 dir = normalize(vWorldPos - pointLightPosition[i]); 
            sumPointLights.rgb += clamp(dot(-dir, vWorldNormal), 0.0, 1.0) * pointLightColor[i];
          }
          #endif
          
          //directional lights 
          vec4 sumDirLights = vec4(0.0, 0.0, 0.0, 1.0); #if MAX_DIR_LIGHTS &gt; 0
          for(int i = 0; i &lt; MAX_DIR_LIGHTS; i++) {
            vec3 dir = directionalLightDirection[i];
            sumDirLights.rgb += clamp(dot(-dir, vWorldNormal), 0.0, 1.0) * directionalLightColor[i];
          }
          #endif

          //take ambient light, add highlight if point sum big enough
          sumLights = sumPointLights + sumDirLights;
          //sumLights = vec4(ambientLightColor, 1.0) + floor( sumLights * vec4(5, 5, 5, 1)) * vec4(0.2, 0.2, 0.2, 1);
          sumLights = vec4(ambientLightColor, 1.0) + sumLights;

          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0)
          * sumLights - 0.05 +
          0.1 * rand( vec3(
          floor(vObjPos.x * 100.0),
          floor(vObjPos.y * 100.0),
          floor(vObjPos.z * 100.0)
          ) * 0.01);

          gl_FragColor = vec4(_baseColor.rgb, 1.0);
        }
      `,
      lights: true
    });

    this.uniforms = UniformsUtils.merge([
      UniformsLib['lights'],
      {
        _noise:  { value: uniforms.noise },
        _baseColor: { value: new Vector3(0, 0, 0) }
      }
    ])
  }
}
