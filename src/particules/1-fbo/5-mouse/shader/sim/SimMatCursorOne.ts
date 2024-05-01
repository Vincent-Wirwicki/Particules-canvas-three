import {
  DataTexture,
  FloatType,
  RGBAFormat,
  ShaderMaterial,
  Vector3,
} from "three";
import { getRandom } from "../../../../0-dataShape/getRandom";

const getRing = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const theta = Math.random() * Math.PI;

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

export default class SimMatCursorOne extends ShaderMaterial {
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

    #define PI 3.1415926538
      
    const float EPS = 0.001;
    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    float mod289(float x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    float permute(float x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    float taylorInvSqrt(float r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    vec4 grad4(float j, vec4 ip) {
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p, s;
        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
        return p;
    }
    #define F4 0.309016994374947451

    vec4 simplexNoiseDerivatives (vec4 v) {
        const vec4  C = vec4( 0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
        vec4 i = floor(v + dot(v, vec4(F4)) );
        vec4 x0 = v -   i + dot(i, C.xxxx);
        vec4 i0;
        vec3 isX = step( x0.yzw, x0.xxx );
        vec3 isYZ = step( x0.zww, x0.yyz );
        i0.x = isX.x + isX.y + isX.z;
        i0.yzw = 1.0 - isX;
        i0.y += isYZ.x + isYZ.y;
        i0.zw += 1.0 - isYZ.xy;
        i0.z += isYZ.z;
        i0.w += 1.0 - isYZ.z;
        vec4 i3 = clamp( i0, 0.0, 1.0 );
        vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
        vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
        vec4 x1 = x0 - i1 + C.xxxx;
        vec4 x2 = x0 - i2 + C.yyyy;
        vec4 x3 = x0 - i3 + C.zzzz;
        vec4 x4 = x0 + C.wwww;
        i = mod289(i);
        float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
        vec4 j1 = permute( permute( permute( permute (
        i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
        + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
        + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
        + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
        vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
        vec4 p0 = grad4(j0, ip);
        vec4 p1 = grad4(j1.x, ip);
        vec4 p2 = grad4(j1.y, ip);
        vec4 p3 = grad4(j1.z, ip);
        vec4 p4 = grad4(j1.w, ip);
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        p4 *= taylorInvSqrt(dot(p4, p4));
        vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)); //value of contributions from each corner at point
        
        vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
        vec3 m0 = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0); //(0.5 - x^2) where x is the distance
        
        vec2 m1 = max(0.5 - vec2(dot(x3, x3), dot(x4, x4)), 0.0);
        vec3 temp0 = -6.0 * m0 * m0 * values0;
        vec2 temp1 = -6.0 * m1 * m1 * values1;
        vec3 mmm0 = m0 * m0 * m0;
        vec2 mmm1 = m1 * m1 * m1;
        float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;
        float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;
        float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;
        // float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;
        
        
        // return vec4(dx, dy, dz, dw) * 49.0;
        return vec4(dx, dy, dz, 0.0) * 49.0;
    }
    vec3 curl( in vec3 p, in float noiseTime, in float persistence ) {
        vec4 xNoisePotentialDerivatives = vec4(0.0);
        vec4 yNoisePotentialDerivatives = vec4(0.0);
        // vec4 zNoisePotentialDerivatives = vec4(0.0);


        for (int i = 0; i < 2; ++i) {
            float twoPowI = pow(2.0, float(i));
            float scale = 0.5 * twoPowI * pow(persistence, float(i));
            xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * twoPowI, noiseTime)) * scale;
            yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * twoPowI, noiseTime)) * scale;
            // zNoisePotentialDerivatives += snoise4(vec4((p + vec3(-9519.0, 9051.0, -123.0)) * twoPowI, noiseTime)) * scale;
        }
        return vec3(
        yNoisePotentialDerivatives[1] - xNoisePotentialDerivatives[1], yNoisePotentialDerivatives[2] - xNoisePotentialDerivatives[2], yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[0]
        );
    }
 
    void main() {
      vec2 uv = vUv;   
      // vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 pos2 = texture2D( uPositions2, uv ).xyz;

      float radius = length(pos.xy);
      float speed = 0.75;
      float force = 1.-smoothstep(0.3,1.4, abs(pos.x - radius));
      float angle = atan(pos.y, pos.x) - pos2.y *speed*mix(0.5,1.8,force);

      float targetRadius = mix(pos2.x, 1.75, .5 +0.45*sin(angle + uTime ));

      radius +=(targetRadius - radius)*mix(0.75,0.5, force);

      vec3 targetPos = vec3(cos(angle), sin(angle),0.)*radius;

      pos.xy += (targetPos.xy - pos.xy)  * 0.1;

      pos.xy += curl(pos.xyz *1.5, uTime*0.75, .1).xy*0.01;

      //a counter force to keep center black
      float distCenter = length(pos.xy - vec2(0.5));
      vec2 dirToCenter = normalize(pos.xy );
      pos.xy+= dirToCenter * 0.1 * smoothstep(0.25,0.,radius*0.15);
      
      vec3 mouse = vec3(uMouse.x*5., uMouse.y*5., 1.);
      float dist = length(pos.xy - mouse.xy);
      vec2 dir = normalize(pos.xy - mouse.xy);
      pos.xy += dir * .15 * smoothstep(1.,0., dist );

    //  - pos2.y *speed*mix(0.5,1.8,force1);
      gl_FragColor = vec4(pos,1.);
      }`,
    });
  }
}