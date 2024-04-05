import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getTorusWeird } from "../../../../../0-dataShape/getTorusKnot";

export default class SimMat extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getTorusWeird(size, 6, 1, 3),
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
        varying float vAlpha;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position,1. );
          }
      `,
      fragmentShader: /* glsl */ `
      uniform sampler2D uPositions;
      uniform float uTime;
      varying vec2 vUv;

      vec2 rotate(vec2 v, float a) {
	      float s = sin(a);
	      float c = cos(a);
	      mat2 m = mat2(c, s, -s, c);
	      return m * v;
      }
  
    void main() {
      vec2 uv = vUv;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 copy = pos;
      float time = uTime *0.5;
      
      pos += sin(pos + time*0.1) * cos(pos + time*0.1) * 3.141592;
      pos += sin(pos + time*0.1) * cos(pos + time*0.1) * 6.283184;
      
      vec3 render = mix(copy, pos, sin(uTime *0.15));
      render.xz = rotate(render.xz, uTime*0.075);
      
      gl_FragColor = vec4( render, 1. );
      }`,
    });
  }
}
