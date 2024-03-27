import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getSphere } from "../../../0-utils-shape-func/shapesFunction";

// const m = useGLTF("./public/bust-hi.glb");
export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getSphere(size, 5),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    // const m = getDataModel();

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

      vec3 DeqanAttractor(vec3 pos, float t){
        float a = 40.0;
        float b = 1.833;
        float c = 0.16;
        float d = 0.65;
        float e = 55.0;
        float f = 20.0;

        vec3 target = vec3(0.);

        target.x = ( a*(pos.y-pos.x) + c*pos.x*pos.z);
        target.y = (e*pos.x + f*pos.y - pos.x*pos.z);
        target.z = (b*pos.z + pos.x*pos.y - d*pos.x*pos.x);

        return target *t;

      }  

      vec3 HalvorsenAttractor(vec3 pos, float t){
        float a = 1.4;

        vec3 target = vec3(0.);

        target.x = a*pos.x - 4.*pos.y - 4.*pos.z - pos.y*pos.y;
        target.y = a*pos.y - 4.*pos.z - 4.*pos.x - pos.z*pos.z;
        target.z = a*pos.z - 4.*pos.x - 4.*pos.y - pos.x*pos.x;

        return target *t;

      }      
      
      vec3 RosslerAttractor(vec3 pos, float t){
        float a=0.2;
        float b=0.2;
        float c=5.7;
        
        vec3 target = vec3(0);

        target.x = pos.y - pos.z;
        target.y = pos.x + a*pos.y;
        target.z = b + pos.z*(pos.x - c);

        return target *t;

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

      vec3 ChenLeeAttractor(vec3 pos, float t){
        float a = 5.;
        float b = -10.;
        float d = 2.6666666667;

        vec3 target = vec3(0);

        target.x = a * pos.x - pos.y * pos.x;
        target.y = b * pos.y + pos.x * pos.z;
        target.z =d*pos.z + (pos.x*pos.y)/3.;
        // (c + a * Z - Z*Z*Z / 3.0 - (X*X + Y*Y)*(1.0 + e*Z) + f * Z * X*X*X)
        return target * t;
      } 

      vec3 LorenzAttractor(vec3 pos, float t){
        float a = 10.0;
        float b = 28.0;
        float c = 2.6666666667;
        vec3 target = vec3(0);
        
        target.x = (a * (pos.y - pos.x)) ;
        target.y = (pos.x * (b-pos.z) - pos.y) ;
        target.z = (pos.x*pos.y - c*pos.z) ;
      
        return target * t;

      }

      vec3 AlorenzMod2Attractor(vec3 pos, float t){
        float a = 10.0;
        float b = 28.0;
        float c = 2.6666666667;

        vec3 target = vec3(0);

        target.x = a * (pos.y - pos.x);
        target.y = pos.x * (b - pos.z) - pos.y ;
        target.z =(pos.x * pos.y  - c*pos.z);
        // (c + a * Z - Z*Z*Z / 3.0 - (X*X + Y*Y)*(1.0 + e*Z) + f * Z * X*X*X)
        return target * t;
      } 

      vec3 AizawaAttractor(vec3 pos, float t){
        float a = .95;
        float b = .7;
        float c = .6;
        float d = 3.5;
        float e = .25;
        float f = .1;

        vec3 target = vec3(0.);

        target.x = (pos.z - b) * pos.x - d*pos.y;
        target.y = d*pos.x + (pos.z - b) * pos.y ;
        target.z = c + a*pos.z - pos.z * pos.z * pos.z / 3. - (pos.x * pos.x + pos.y*pos.y)*(1. + e*pos.z) + f * pos.z * pos.x * pos.x * pos.x;
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

      vec3 thomasAttractor(vec3 pos, float t){
        
      float b = 0.19;
      vec3 target = vec3(0);              
      target.x = (-b*pos.x + sin(pos.y)) ;
      target.y = (-b*pos.y + sin(pos.z)) ;
      target.z = (-b*pos.z + sin(pos.x)) ;
        
      return target * t;
    }

    void main() {
      vec2 uv = vUv;   
      vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 p = pos;
      // vec3 target = AizawaAttractor((pos * .15) , 0.15);
      
      //infinit stability
      // vec3 target = thomasAttractor(pos , 0.075);
      
      //vanish
      // vec3 target = thomasAttractor(pos - sin(uTime *0.5)   , sin(0.05 ));

      // looks cool
      // vec3 target = thomasAttractor(pos + (sin(uTime *0.75 -0.25) -0.25)*.25-cos(uTime *.25)   , 0.05);

      // looks cool
      vec3 target = AizawaAttractor(pos *0.25, 0.0075);

      // vec3 target = RosslerAttractor(pos *1.1 + cos(uTime *0.5) * sin(uTime*0.5), 0.015);

       // looks cool
      // vec3 target = DeqanAttractor(pos*0.1, 0.0015);

      float dist = length(target-pos);
      pos+=target ;
      // target = mix(p, target, sin(uTime*0.01));


      gl_FragColor = vec4( pos, 1. );

      }`,
    });
  }
}
