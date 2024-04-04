import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getLab } from "../../../../../0-dataShape/getLab";

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getLab(size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    positionsTexture.needsUpdate = true;

    super({
      uniforms: {
        uPositions: { value: positionsTexture },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position,.8 );
        }
      `,
      fragmentShader: /* glsl */ `
      precision mediump float;
      uniform sampler2D uPositions;
      uniform float uTime;
      varying vec2 vUv;

      #define PI 3.141592
      
      vec2 rotate(vec2 v, float a) {
	      float s = sin(a);
	      float c = cos(a);
	      mat2 m = mat2(c, s, -s, c);
	      return m * v;
      }
      
    void main() {
      vec2 uv = vUv;
      
      vec3 pos = texture2D( uPositions, uv ).xyz;
      pos.xy = rotate(pos.xy, uTime*0.1);

      gl_FragColor = vec4( pos, 1. );

      }`,
    });
  }
}
