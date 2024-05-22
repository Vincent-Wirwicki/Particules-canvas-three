import { ShaderMaterial } from "three";

export default class RenderMatShapeOne extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uPositions: { value: null },
        uTime: { value: 0 },
      },
      fragmentShader: /* glsl */ `
        uniform float uTime;
        void main() {        
          float dist = length(gl_PointCoord.xy - vec2(0.5)) *0.5;
          vec3 color = vec3(0.15,0.45,0.75);

          gl_FragColor = vec4(color,1.);
        }`,

      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;    
          vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.);
          gl_PointSize = 1. * (1./ -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }`,
    });
  }
}
