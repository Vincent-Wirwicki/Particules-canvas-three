import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
// import { getTorusWeird } from "../../../../1-shapes/0-utils-shape-func/torusKnotData";

const getRandom = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    const x = Math.PI * Math.random() * 2 - 1;
    const y = Math.PI * Math.random() * 2 - 1;
    const z = Math.PI * Math.random() * 2 - 1;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }
  return data;
};

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getRandom(size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    const positionsTexture2 = new DataTexture(
      getRandom(size),
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
      
    vec3 thomasAttractor(vec3 pos, float t){   
      float b = 0.19;
      vec3 target = vec3(0);              
      target.x = (-b*pos.x + sin(pos.y)) ;
      target.y = (-b*pos.y + sin(pos.z)) ;
      target.z = (-b*pos.z + sin(pos.x)) ;   
      return target * t;
    }

    vec3 SprotzLinzFAttractor(vec3 pos, float t){
        float a = 5.;
        float b = -10.;
        float d = 2.6666666667;

        vec3 target = vec3(0);

        target.x = pos.y + pos.z;
        target.y = -pos.x + a * pos.y;
        target.z =(pos.x*pos.x) - pos.z;
        // (c + a * Z - Z*Z*Z / 3.0 - (X*X + Y*Y)*(1.0 + e*Z) + f * Z * X*X*X)
        return target * t;
      } 
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

      float radius = length(pos.xyz);
      float angle = atan(pos.x, pos.y) * radius;
    
      float disp = (sin(uTime *0.015 -0.5))*cos(pos2.x  *0.15 - 0.5);
      
      vec3 target = dadrasAttractor(pos + disp, 0.005);
      float d  = length(target - pos2);
      pos+= (target) *0.5 *d;

     
      gl_FragColor = vec4(pos, 1.);
      }`,
    });
  }
}
