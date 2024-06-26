import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getSphere } from "../../../../../0-dataShape/getSphere";
// import { getRandom, getRandomPI } from "../../../../../0-dataShape/getRandom";
import { getThomas } from "../../../../../0-dataShape/getLab";
// import { getTorusWeird } from "../../../../../0-dataShape/getTorusKnot";
// import { getLab2 } from "../../../../../0-dataShape/getLab";
// import { getRandomPI } from "../../../../../0-dataShape/getRandom";
// import { getAttractor } from "../../../../../0-dataShape/getLab";
// import { getRandomLab } from "../../../../../0-dataShape/getLab";
// import { getTorusWeird } from "../../../../../0-dataShape/getTorusKnot";

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getThomas(size),
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

    #define PI 3.141592653589793

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
    //for t != 1
    // vec3 dadrasAttractorD(vec3 pos, float t){
    //   float a = 3.;
    //   float b = 2.7;
    //   float c = 1.7;
    //   float d = 2.;
    //   float e = 9.;
    //   vec3 target = vec3(0);
    //   target.x = -a * (pos.x / t) + (1.0 + b * pos.z) * (pos.y / t) + (b * pos.y) * (pos.z / t);
    //   target.y = -pos.z * (pos.x / t) + c * (pos.y / t) + (pos.z / t);
    //   target.z = (d * pos.y) * (pos.x / t) + (d * pos.x) * (pos.y / t) - e * (pos.z / t);
    //   return target * t;
    // }

    //for t = 1
    vec3 dadrasAttractorD1(vec3 pos ){
      float a = 3.;
      float b = 2.7;
      float c = 1.7;
      float d = 2.;
      float e = 9.;
      vec3 target = vec3(0);
      target.x = -a * (pos.x) + (1.0 + b * pos.z) * (pos.y ) + (b * pos.y) * (pos.z );
      target.y = -pos.z * (pos.x ) + c * (pos.y ) + (pos.z );
      target.z = (d * pos.y) * (pos.x ) + (d * pos.x) * (pos.y ) - e * (pos.z );
      return target;
    }

    vec3 thomasAttractorD(vec3 pos){   
      float b = 0.19;
      vec3 target = vec3(0);              
      target.x = -b; // Derivative of (-b*pos.x) with respect to pos.x
      target.y = cos(pos.y); // Derivative of sin(pos.y) with respect to pos.y
      target.z = 0.0; // Derivative of sin(pos.z) with respect to pos.
      return target;
    }

    

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
 vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

    vec4 permute(const in vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }

    float snoise(vec3 v)
      {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }

    vec3 snoiseVec3( vec3 x ){
      float s  = snoise(vec3( x ));
      float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;  
    }

    vec3 curlNoise( vec3 p ){

      const float e = .1;
      vec3 dx = vec3( e   , 0.0 , 0.0 );
      vec3 dy = vec3( 0.0 , e   , 0.0 );
      vec3 dz = vec3( 0.0 , 0.0 , e   );
    
      vec3 p_x0 = snoiseVec3( p - dx );
      vec3 p_x1 = snoiseVec3( p + dx );
      vec3 p_y0 = snoiseVec3( p - dy );
      vec3 p_y1 = snoiseVec3( p + dy );
      vec3 p_z0 = snoiseVec3( p - dz );
      vec3 p_z1 = snoiseVec3( p + dz );
    
      float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    
      const float divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );
    
    }
      vec3 AlorenzMod2Attractor(vec3 pos, float t){
        const float a = 10.0;
        const float b = 28.0;
        const float c = 2.6666666667;

        vec3 target = vec3(0);

        target.x = a * (pos.y - pos.x);
        target.y = pos.x * (b - pos.z) - pos.y ;
        target.z =(pos.x * pos.y  - c*pos.z);
        return target * t;
        
      } 
	
      vec3 attractor(vec3 pos, float dt){
        const float a = .9;	
        const float b = 5.;
        const float c = 9.9;
        const float d = 1.;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -a *x + y*y - z*z + a*c;
        target.y = x*(y - b*z) + d;
        target.z = z + x * (b*y + z);

        return target * dt ;
      }

      vec3 attractorD(vec3 pos, float dt){
        const float a = 5.;
        const float b = -10.;
        const float c = -0.38;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = cos(x);
        target.y = sin(y);
        target.z = sin(z);

        return target *dt  ;
      }
         
      vec2 rotate(vec2 v, float a) {
	      float s = sin(a);
	      float c = cos(a);
	      mat2 m = mat2(c, s, -s, c);
	      return m * v;
      }
    vec3 thomasAttractor(vec3 pos, float t){   
      const float b = 0.19;
      
      vec3 target = vec3(0); 
      float x = pos.x;
      float y = pos.y;
      float z = pos.z;

      target.x = -b*x + sin(y) ;
      target.y = -b*y + sin(z) ;
      target.z = -b*z + sin(x) ;   
      
      return target * t;
    }

    float map(float v, float iMin, float iMax ) { return (v-iMin)/(iMax-iMin); }
    float mapF(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
    vec3 map3(in vec3 v, in vec3 iMin, in vec3 iMax, in vec3 oMin, in vec3 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    float easeInOutQuad(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
}

    void main() {
      vec2 uv = vUv;   
      vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 pos2 = texture2D( uPositions2, uv ).xyz;
      
      //gif setup -------------------------------------------------------------------------------
float loopLength = 5.;
      float transitionStart = 20.;
      float time = mod(uTime , loopLength );
      float transitionProgress = map(time, transitionStart, loopLength);
      vec3 q = pos;
      vec3 q2 = pos2;
      pos /= transitionProgress;
      pos2 *= transitionProgress;
      vec3 n = curlNoise(pos) *.15;
      vec3 n2 = snoiseVec3(pos2) * 0.15;
      vec3 disp = q +  thomasAttractor(pos2, 0.05  );
      vec3 target = q +  thomasAttractor(pos, 0.05  );
      // target += sin(pos2 *2.)*0.01;
      float d = length(target - disp)*.3;
      // target += disp*0.01;
      target += d;


      //--------------------------------------------------------------------------------------------

      // pos += target * s;
      // pos += dir *0.01;
      gl_FragColor = vec4(target, 1.);
      }`,
    });
  }
}

// float sdCappedCylinder( vec3 p, float h, float r )
// {
//   vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
//   return min(max(d.x,d.y),0.0) + length(max(d,0.0));
// }
// float animationDuration = 3.0; // Duration of animation cycle
// float t = uTime / animationDuration; // Normalized time within the animation cycle
// vec3 repeatOffset = vec3(.0, .0,0.); // Adjust as needed for different axes

// float loopLength = 5.;
//       float transitionStart = 15.;
//       float time = mod(uTime , loopLength );
//       float transitionProgress = map(time, transitionStart, loopLength);
//       vec3 q = pos;
//       vec3 q2 = pos2;
//       pos += transitionProgress;
//       pos2 += transitionProgress;
//       vec3 disp = q + transitionProgress * thomasAttractor(pos2 / transitionProgress +2.*PI , 0.05 / transitionProgress );
//       vec3 target = q + transitionProgress * thomasAttractor(pos * transitionProgress  , 0.05 / transitionProgress );
//       // target += sin(pos2 *2.)*0.01;
//       float d = length(target - disp)*.025;
//       // target += disp*0.01;
//       target += d;

// float loopLength = 4.;
// float transitionStart = 12.;
// float time = mod(uTime , loopLength );
// float transitionProgress = map(time, transitionStart, loopLength);
// float progress = (time - transitionStart) / loopLength;
// vec3 q = pos;
// vec3 q2 = pos2;
// pos /= transitionProgress;
// pos2 /= transitionProgress;
// vec3 target;
// vec3 disp;
// for(int i = 0; i< 20; i++){
//   float j = float(i);

//   disp = q +   thomasAttractor((pos2  )  , (0.005 * j)   );
//  target = q +  thomasAttractor(pos   , (0.005 * j)   );
// }

// // target += sin(pos2 *2.)*0.01;
// float d = length(target - disp)*.05;
// // target += disp*0.01;
// target += d;

// //--------------------------------------------------------------------------------------------

// // pos += target * s;
// // pos += dir *0.01;
// gl_FragColor = vec4(target, 1.);
