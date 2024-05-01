import { ShaderMaterial } from "three";

export default class RenderMatAttractOne extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uPositions: { value: null },
        uTime: { value: 0 },
      },
      fragmentShader: /* glsl */ `
        uniform float uTime;
        void main() {        
          vec3 color = vec3(0.45,0.25,0.1);
          gl_FragColor = vec4(color, 1.);
        }`,
      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        varying vec2 vUv;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.);
          gl_PointSize = 5. * (1./ -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

        }`,
    });
  }
}

// vec3 pos = texture2D(uPositions, position.xy).xyz;

// vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
// vec4 viewPosition = viewMatrix * modelPosition;
// vec4 projectedPosition = projectionMatrix * viewPosition;

// gl_Position = projectedPosition;

// gl_PointSize = 2.0;
// Size attenuation;
// gl_PointSize *= step(1.0 - (1.0/512.0), position.x) + 0.5;
