import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
import { getTorusKnot } from "../../../0-utils-shape-func/shapesFunction";

export default class SimMatCurlTwo extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getTorusKnot(size, 4, 3, 3),
      size,
      size,
      RGBAFormat,
      FloatType
    );

    positionsTexture.needsUpdate = true;

    super({
      uniforms: {
        uPositions: { value: positionsTexture },
        // uPositions2: { value: positionsTexture2 },
        uTime: { value: 0 },
      },

      vertexShader: /* glsl */ `
        varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position,.8 );
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
        
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
        
    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);
    
        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);
    
        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);
    
        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));
    
        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    
        return o4.y * d.y + o4.x * (1.0 - d.y);
    }

    float fbm(vec3 x) {
    	float v = 0.0;
    	float a = 0.5;
    	vec3 shift = vec3(100);
    	for (int i = 0; i < 5; ++i) {
    		v += a * noise(x);
    		x = x * 2.0 + shift;
    		a *= 0.5;
    	}
    	return v;
    }

    //-------------------------------------------------------------------------

    void main() {
      vec2 uv = vUv;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      float n = fbm(pos*2. + uTime *0.1);
      pos +=n;
      pos.y = pos.y -0.35;
      pos.x = pos.x -0.4;
      // pos.z = pos.z + sin(uTime*0.1);
      // pos+=curlNoise(pos + uTime *0.01);
      // pos.xy = rotate(pos.xy, 0.5);
      
      gl_FragColor = vec4( pos , 1. );

      }`,
    });
  }
}
