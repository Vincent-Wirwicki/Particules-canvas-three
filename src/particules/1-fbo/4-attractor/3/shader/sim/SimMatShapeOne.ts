import {
  DataTexture,
  FloatType,
  // NearestFilter,
  RGBAFormat,
  ShaderMaterial,
  Vector3,
} from "three";
// import {
//   getSphere,
//   getTorusKnot,
// } from "../../../../1-shapes/0-utils-shape-func/shapesFunction";
// import { getTorusKnot } from "../../../../1-shapes/0-utils-shape-func/shapesFunction";

const getRing = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const theta = Math.random() * Math.PI;

    //  const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 2 - 1;
    // const r1 = Math.random() * 2 - 1;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = 1;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }
  return data;
};

const getRandom = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    // const theta = Math.random() * Math.PI * 2;
    // const r = Math.random() * 0.5 - 0.5;
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const z = 1;

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
      getRing(size),
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
    // positionsTexture.magFilter = NearestFilter;
    // positionsTexture.minFilter = NearestFilter;
    positionsTexture.needsUpdate = true;
    positionsTexture2.needsUpdate = true;

    super({
      uniforms: {
        uPositions: { value: positionsTexture },
        uPositions2: { value: positionsTexture2 },
        uMouse: { value: new Vector3() },
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
        uniform vec3 uMouse;


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

    /*
    contributors: [Stefan Gustavson, Ian McEwan]
    description: Simplex Noise https://github.com/stegu/webgl-noise
    use: snoise(<float2|float3|float4> pos)
    license: |
        Copyright 2021-2023 by Stefan Gustavson and Ian McEwan.
        Published under the terms of the MIT license:
        https://opensource.org/license/mit/
    */
    vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

    vec4 permute(const in vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }

    float snoise(in vec3 v) {
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
  
    void main() {
      vec2 uv = vUv;   
      // vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 pos2 = texture2D( uPositions2, uv ).xyz;
      float disp = snoise(pos*0.1 + uTime);
      pos+=disp;
      gl_FragColor = vec4(pos,1.);
      }`,
    });
  }
}
