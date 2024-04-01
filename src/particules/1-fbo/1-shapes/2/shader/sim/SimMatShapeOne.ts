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
//	<https://www.shadertoy.com/view/Xd23Dh>
//	by inigo quilez <http://iquilezles.org/www/articles/voronoise/voronoise.htm>
//

vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
				   dot(p,vec2(269.5,183.3)), 
				   dot(p,vec2(419.2,371.9)) );
	return fract(sin(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v ){
    vec2 p = floor(x);
    vec2 f = fract(x);
		
	float k = 1.0+63.0*pow(1.0-v,4.0);
	
	float va = 0.0;
	float wt = 0.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = vec2( float(i),float(j) );
		vec3 o = hash3( p + g )*vec3(u,u,1.0);
		vec2 r = g - f + o.xy;
		float d = dot(r,r);
		float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
		va += o.z*ww;
		wt += ww;
    }
	
    return va/wt;
}

// 	<https://www.shadertoy.com/view/MdX3Rr>
//	by inigo quilez
//
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}
const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = p*2.02;
    f += 0.2500*noise( p ); p = p*2.03;
    f += 0.1250*noise( p ); p = p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}
    void main() {
      vec2 uv = vUv;
      float n = fbm(uv*0.1);
      vec3 og = texture2D( uPositions, uv).xyz;
//  vec2 q = vec2(length(p.xz)-t.x,p.y);
//   return length(q)-t.y;
      vec3 pos = texture2D( uPositions, uv).xyz;
      vec2 outterRad = vec2(length(pos.xz) - 0.5, pos.y);
      vec2 innerRad = vec2(length(outterRad));
      vec3 copy = pos;
      vec3 d = texture2D( uPositions, uv + n).xyz;
      float n2 = fbm(pos.xz - vec2(0.,1.1) );
      // vec3 render = max(d,pos*n2*2.1);
    
      vec2 render = mix(pos.xz, innerRad, 0.15);
    


      gl_FragColor = vec4( render,1., 1. );

      }`,
    });
  }
}
