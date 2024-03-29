import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getTorusKnot } from "../../../../1-shapes/0-utils-shape-func/shapesFunction";

// const getThomasAttract = (numPoints: number) => {
//   const size = numPoints * numPoints * 4;
//   const data = new Float32Array(size);
//   for (let i = 0; i < size; i++) {
//     const stride = i * 4;

//     const xx = Math.random() * 0.5;
//     const yy = Math.random() * 0.5;
//     const zz = Math.random() * 0.5;
//     // theta varies from 0 to 2π, and phi varies from 0 to π.
//     // const phi = Math.acos(2 * v - 1);
//     const b = 0.19;

//     const x = -b * xx + Math.sin(yy);
//     const y = -b * yy + Math.sin(zz);
//     const z = -b * zz + Math.sin(xx);

//     data[stride] = xx;
//     data[stride + 1] = yy;
//     data[stride + 2] = zz;
//     data[stride + 3] = 1;
//   }
//   return data;
// };
// float b = 0.19;
// vec3 target = vec3(0);
// target.x = (-b*pos.x + sin(pos.y)) ;
// target.y = (-b*pos.y + sin(pos.z)) ;
// target.z = (-b*pos.z + sin(pos.x)) ;
// return target * t;
export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getTorusKnot(size, 5, 6, 6),
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

    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

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


    vec3 curl( vec3 p ){

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

    vec3 thomasAttractor(vec3 pos, float t){   
      float b = 0.19;
      vec3 target = vec3(0);              
      target.x = (-b*pos.x + sin(pos.y)) ;
      target.y = (-b*pos.y + sin(pos.z)) ;
      target.z = (-b*pos.z + sin(pos.x)) ;   
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
      
      // float freq = smoothstep(0.,.75,uTime);
      float freq = 1.5;
      // float m = mix(2.,3.,uTime);
      float amp = .01;
           
      pos+=curl((pos) * freq +uTime*0.15) *amp;
      pos+=curl((pos) * freq*2. ) *amp*0.5;

      vec3 target = thomasAttractor(pos, 0.02);
      float dist = length(target.xy - pos.xy);
      
      pos+=target ;
      gl_FragColor = vec4(pos, 1.);
      }`,
    });
  }
}
// vec3 target2 = thomasAttractor(pos2, 0.02);
// float speed = smoothstep(0.4,0.3, mix(target.x, target2.y,1.));
// float radius = length(target.xy);

// float circularForce = 1.-smoothstep(0.25,1.,abs(pos2.x - radius));  + sin(uTime *0.1) * 1.-cos(uTime*0.1)
// float angle = atan(pos.x, pos.y) - target2.y*0.5*mix(0.5,1., circularForce);
// float targetRadius = mix(target2.x,1., 0.5*sin(angle + uTime*0.1));
// radius +=(targetRadius - radius) * mix(target2.x, 0.5, circularForce);
// vec2 uv = vUv;
// vec3 pos = texture2D( uPositions, uv ).xyz;
// vec3 disp = pos + cos(uTime *0.25) * sin(uTime*0.5);

// float freq = 2.;
// float amp = .01;
// pos += curl((pos) * freq + uTime *0.1) *amp;

// vec3 target = thomasAttractor(pos, 0.015);

// pos+=target;
// gl_FragColor = vec4(pos, 1.);

// float radius = length(pos.xy);
// float circularForce = 1.- smoothstep(0.25,1.4,abs(pos.x - radius));
// target +=  curl(target.x *freq, target.y *freq, target.z*freq)*amp;

// float d = length(target - pos) * .15;
// vec3 disp = mix( pos, noise, pow( d, 10. ) );

// vec3 target = thomasAttractor(pos + noise *0.5, 0.05);
