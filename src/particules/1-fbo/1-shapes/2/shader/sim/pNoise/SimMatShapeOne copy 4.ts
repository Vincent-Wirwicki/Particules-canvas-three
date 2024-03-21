import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
// import { getSphere } from "../../utils/getSphereFBO";
const getRandomChatGPT = (w: number, h: number) => {
  const size = w * h * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const u = (Math.random() - 0.5) * 10; // Adjust the range as needed
    const v = (Math.random() - 0.5) * 10; // Adjust the range as needed
    const scale = 6; // Adjust the scale as needed

    // Equation for hyperbolic helicoid
    const x = scale * Math.sinh(u) * Math.cos(v);
    const y = scale * Math.sinh(u) * Math.sin(v);
    const z = scale * u;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};
const getHyperHelicoide = (w: number, h: number) => {
  const size = w * h * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    // const d = Math.random() * 2 + 1;
    // const d1 = Math.sqrt(Math.random()) * 2.0;
    const alpha = Math.PI * 2;
    const theta = Math.PI * 2 * Math.random() * 1.5 - 0.5;
    const t = 5;
    const bot = 1 + Math.cosh(alpha) * Math.cosh(theta);

    data[stride] = (Math.cosh(theta) * Math.cos(t * theta)) / bot;
    data[stride + 1] = (Math.cosh(alpha) * Math.sin(t * theta)) / bot;
    data[stride + 2] = (Math.cosh(alpha) * Math.sinh(t * theta)) / bot;
    data[stride + 3] = 1;

    // data[stride] = Math.cosh(alpha);
    // data[stride + 1] = d1 * Math.sin(alpha);
    // data[stride + 2] = alpha * d1;
    // data[stride + 3] = 1;
  }
  return data;
};


export default class SimMatShapeOne extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getRandomChatGPT(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    const positionsTexture2 = new DataTexture(
      getHyperHelicoide(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    // getHyperHelicoide(size, size),
    //   size,
    //   size, getRandomTorusSpiralData(size, size, 3, 10, 10)
    //   RGBAFormat,
    //   FloatType
    // );
    positionsTexture.needsUpdate = true;
    positionsTexture2.needsUpdate = true;

    super({
      uniforms: {
        uPositions: { value: positionsTexture },
        uPositions2: { value: positionsTexture2 },
        uFrequency: { value: 0.02 },
        uAmplitude: { value: 96 },
        uMaxDist: { value: 60 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vAlpha;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.8 );
          }
      `,
      fragmentShader: /* glsl */ `
      uniform sampler2D uPositions;
            uniform sampler2D uPositions2;

      uniform float uTime;
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uMaxDist;

      varying vec2 vUv;
      varying float vAlpha;
//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < 18; ++i) {
		v += a * cnoise(x);
		x = x * 5.0 + shift;
		a *= 0.5;
	}
	return v;
}

    void main() {
      vec2 uv = vUv;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      vec3 pos2 = texture2D( uPositions2, uv ).xyz;
    //   pos-= mod(uTime/30., 3.);
      float n = fbm(pos  + uTime *0.15);
      pos.yz*=n;
      float n1 = fbm(vec3(n *15. + uTime *3.)) / 3.;
      pos2.yz*=n1;
    vec3 render = mix(pos2, pos, abs(sin(uTime*.15 + n)));
    //   float n2 = n * fbm(vec3(n  + uTime*0.025));
    //   pos.xz *= n + n1;
        // vec3 color = mix(pos, pos2, sin(uTime));
    //   pos.z *= sin(uTime);

      gl_FragColor = vec4( render, 1. );

      }`,
    });
  }
}
