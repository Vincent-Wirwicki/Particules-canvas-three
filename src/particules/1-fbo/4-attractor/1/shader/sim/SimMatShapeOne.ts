import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getSphere } from "../../../../1-shapes/0-utils-shape-func/shapesFunction";

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getSphere(size, 5),
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
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
      `,
      fragmentShader: /* glsl */ `
    uniform sampler2D uPositions;
    uniform float uTime;

    varying vec2 vUv;

     vec3 dadrasAttractor(vec3 pos, float t){
        float a = 3.;
        float b = 2.7;
        float c = 1.7;
        float d = 2.;
        float e = 9.;

        vec3 target = vec3(0);

        target.x = (pos.y- a*pos.x +b*pos.y*pos.z) ;
        target.y = (c*pos.y -pos.x*pos.z +pos.z) ;
        target.z = (d*pos.x*pos.y - e*pos.z);
        return target * t;
      }
      
    void main() {
      vec2 uv = vUv;   
      vec3 pos = texture2D( uPositions, uv ).xyz;
      float disp = (sin(uTime *0.75 -0.25) -0.25)*.25-cos(uTime *.25);
      vec3 target = dadrasAttractor(pos, 0.0075);

      pos+=target;
     
      gl_FragColor = vec4(pos, 1.);
      }`,
    });
  }
}
