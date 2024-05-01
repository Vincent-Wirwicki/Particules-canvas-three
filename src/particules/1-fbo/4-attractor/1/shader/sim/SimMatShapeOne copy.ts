import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getRandomPI } from "../../../../../0-dataShape/getRandom";
import { getSphere } from "../../../../../0-dataShape/getSphere";
// import { getRandomLab } from "../../../../../0-dataShape/getLab";
// import { getTorusWeird } from "../../../../../0-dataShape/getTorusKnot";

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getRandomPI(size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    const positionsTexture2 = new DataTexture(
      getSphere(size, 1),
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
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
      `,
      fragmentShader: /* glsl */ `
    uniform sampler2D uPositions;
    uniform sampler2D uPositions2;

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
      vec3 pos2 = texture2D( uPositions2, uv ).xyz;

    
      float disp = cos(pos.x  *0.15 - 0.5);
      float radius = length(pos);

      vec3 target2 = dadrasAttractor(pos2 , 0.006) ;
      // float k = sin(pos *1.5 + uTime);
      float r = length(pos2);
      vec3 a = normalize(target2);
      float f = smoothstep(0.,.1, (target2.x - pos.x));

      vec3 target = dadrasAttractor(pos + r , 0.005) ;


      float d  = length(target2 - pos2);
      // target *=d;
      pos+=(target);
      // pos+=target2;

     
      gl_FragColor = vec4(pos, 1.);
      }`,
    });
  }
}