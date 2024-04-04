import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getLab, getLab2 } from "../../../../../0-dataShape/getLab";

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getLab(size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    const positionsTexture2 = new DataTexture(
      getLab2(size),
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
      
      #define PI 3.141592

      
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

// x = Math.cos(s) * Math.sinh(v)*Math.sin(u) + Math.sin(s) * Math.cosh(v)*Math.cos(u)
// y = -Math.cos(s) * Math.sinh(v)*Math.sin(u) + Math.sin(s) * Math.cosh(v)*Math.cos(u)
// z = u * Math.cos(s) + v*sin(s)
    void main() {
      vec2 uv = vUv;
      // float lod = pow(1.0-r,4.0)*5.0;
      vec2 newUv = uv;
      float dispUv = worley(vec3(newUv.xy, 1.)+uTime);
      vec3 pos = texture2D( uPositions, uv).xyz;
      vec3 pos2 = texture2D( uPositions2, uv).xyz;
      vec3 target = vec3(2.3 * sin(pos2.y) + cos(pos2.x), 0.3*cos(pos2.y) + sin(pos2.x), 1.3*cos(pos.z));
      
      vec3 q = twist(pos *0.1, 5.);
      vec3 q1 = twist(sin(pos2 + uTime), 1.) - mix(q, pos2, 0.075);

      float n = worley(pos.zyx + uTime);
      // pos2 += target*0.1;
      // q1 += dr; 4.0/(1.0+4.0*col)
      // pos2.xy = rotate(pos2.xy, uTime);
      // pos2 *=8./(1.+8.*pos2);
      // pos2 = 8.*pos2 + sin(8.);

      pos2.xy = rotate(pos2.xy, uTime);
      gl_FragColor = vec4( q1, 1. );

      }`,
    });
  }
}
