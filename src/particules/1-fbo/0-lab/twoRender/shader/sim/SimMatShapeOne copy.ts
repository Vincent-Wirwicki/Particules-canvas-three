import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
// import { getLab } from "../../../../../0-dataShape/getLab";
import { getRandom, getRandomPI } from "../../../../../0-dataShape/getRandom";

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
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position,1. );
          }
      `,
      fragmentShader: /* glsl */ `
      uniform sampler2D uPositions;
      uniform sampler2D uPositions2;
      uniform float uTime;
      varying vec2 vUv;
      
      #define PI 3.141592653589793
      
      vec2 rotate(vec2 v, float a) {
	      float s = sin(a);
	      float c = cos(a);
	      mat2 m = mat2(c, s, -s, c);
	      return m * v;
      }

      vec3 twist(vec3 p, float k ){
       // or some other amount
        float c = cos(k*p.y);
        float s = sin(k*p.y);
        mat2  m = mat2(c,-s,s,c);
        vec3  q = vec3(m*p.xz, p.y);
        return q;
      }


      /*
contributors: Patricio Gonzalez Vivo
description: Worley noise
use: <vec2> worley(<vec2|vec3> pos)
examples:
    - /shaders/generative_worley.frag
*/


    vec3 random3(vec3 p) {
    p = fract(p *  vec4(.1031, .1030, .0973, .1099).xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

    float worley(vec3 p) {
    vec3 n = floor( p );
    vec3 f = fract( p );

    float dis = 1.0;
    for( int k = -1; k <= 1; k++ )
        for( int j= -1; j <= 1; j++ )
            for( int i=-1; i <= 1; i++ ) {	
                vec3  g = vec3(i,j,k);
                vec3  o = random3( n + g );
                vec3  delta = g+o-f;
                float d = length(delta);
                dis = min(dis,d);
    }

    return 1.0-dis;
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
    const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

    vec3 fbm(vec3 p, float amp, float freq){

      vec3 value =vec3(0.) ;
      float ampScale = 0.5; 
      float freqScale = 2.;
      int octaves = 5;
    
      for (int i = 0; i < octaves; i++) {
        value += amp * snoiseVec3(p * freq)  ;
        p += twist(p,4.);
        // p*= idk;
        freq*= freqScale;
        amp *=ampScale;
      }
    
      return value;
    
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
float sdVerticalCapsule( vec3 p, float h, float r )
{
  p.y -= clamp( p.y, 0.0, h );
  return length( p ) - r;
}

float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}
// x = Math.cos(s) * Math.sinh(v)*Math.sin(u) + Math.sin(s) * Math.cosh(v)*Math.cos(u)
// y = -Math.cos(s) * Math.sinh(v)*Math.sin(u) + Math.sin(s) * Math.cosh(v)*Math.cos(u)
// z = u * Math.cos(s) + v*sin(s)
    void main() {
      vec2 uv = vUv;
      // float lod = pow(1.0-r,4.0)*5.0;
      vec3 pos1 = texture2D( uPositions, uv).xyz;
      vec3 pos2 = texture2D( uPositions2, uv ).xyz;
      
      vec3 target1 = pos1;
      vec3 target2  = pos2;
      float seed = snoise(vec3(0.15,0.25,0.1));
      float freq = mix(0.25,.15, sin(uTime*0.75));
      float amp = mix(0.25,.15,sin(uTime*0.25));
     

      float animationDuration = 10.0; // Duration of animation cycle
      float t = uTime / animationDuration; // Normalized time within the animation cycle
      vec3 repeatOffset = vec3(1.0, 1.0,0.); // Adjust as needed for different axes

      vec3 p = pos1 - repeatOffset * fract(t);

      // float cap = sdVerticalCapsule(pos2, .5,2.);
      float r = length(pos1);
      // float f = smoothstep(0.,.5,abs(pos1.x - cap));
      float a = atan(pos1.x, pos1.y) ;
      // vec3 t = vec3(cos(a), sin(a),1.);

      // pos1 += (t - pos1) *0.5; 
      // curlPos = curlNoise(pos * d + freq) * amp ;
      target1 += curlNoise(pos1);
      float w = worley(pos1);

      vec3 dir = normalize(target1);
      // float dist = nt.x* r smoothstep(0.,10.,sin(uTime));
      float f2 = smoothstep(0.,10., abs(target1.x));
      target1 += fbm(target1, 0.25, 0.15) ;
      target1 -= dir * r * 0.075 ;
      pos1 += (target1 - p)*0.3;
      // vec3 t2 =SprotzLinzFAttractor(target1,0.05);
      // target1 +=t2; 
      // target2 = curlNoise(pos1);
      // target2 += fbm(target1, freq, amp);

      // vec3 render = mix(target1*0.15, target2, 0.5);
      // vec3 render = min(target1,pos1);

      // pos2 += (curlPos - pos2) *0.5;
      // curlPos += fbm(curlPos *2. + 1.-cos(uTime *0.5), 0.25, 0.15) ;

      // float time = mod(uTime, 10.);
      // vec3 p1 = (fbm(curlPos + time, .15, 0.15));
      // vec3 p2 = (fbm(curlPos + time -3., .15, 0.15));
      // curlPos += clamp( pos.y, 0.0, pos2.y );
      // vec3 target =SprotzLinzFAttractor(pos,0.05);
      // curlPos +=target;

      // vec3 render = mix(p1, p2, clamp((time - 2.5) / (3.-2.5), 0.,1.));
      
      // vec3 render = mix(pos, curlPos, smoothstep(0.,20., abs(pos.x + pos2.y) + uTime));
// 0.5 * smoothstep(pos.x,10., clamp( pos.y, 0.0, pos2.y ))
      gl_FragColor = vec4( pos1, 1. );

      }`,
    });
  }
}