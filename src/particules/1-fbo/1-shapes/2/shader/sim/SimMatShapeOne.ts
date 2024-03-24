import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getTorusKnot } from "../../../0-utils-shape-func/shapesFunction";

// const m = useGLTF("./public/bust-hi.glb");
export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number, data: Float32Array) {
    const positionsTexture = new DataTexture(
      data,
      size,
      size,
      RGBAFormat,
      FloatType
    );
    // const m = getDataModel();

    const positionsTexture2 = new DataTexture(
      getTorusKnot(size, 4, 7, 4),
      size,
      size,
      RGBAFormat,
      FloatType
    );

    positionsTexture.needsUpdate = true;
    positionsTexture2.needsUpdate = true;

    super({
      uniforms: {
        uPositions: { value: positionsTexture },
        uPositions2: { value: positionsTexture2 },

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
      uniform sampler2D uPositions;
      uniform sampler2D uPositions2;

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
      
      pos.y = pos.y + 10.;
      pos.z = pos.z + 10.;
      pos+= sin(pos + uTime);
      pos.xy = rotate(pos.xy, 0.5);

      gl_FragColor = vec4( pos, 1. );

      }`,
    });
  }
}
