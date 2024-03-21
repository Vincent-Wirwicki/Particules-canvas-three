import {
  DataTexture,
  FloatType,
  MathUtils,
  RGBAFormat,
  ShaderMaterial,
} from "three";
// import { getSphere } from "../../utils/getSphereFBO";

const getRandomDataSphere = (width: number, height: number) => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  const length = width * height * 4;
  const data = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const stride = i * 4;

    const distance = Math.sqrt(Math.random()) * 2.0;
    const theta = MathUtils.randFloatSpread(360);
    const phi = MathUtils.randFloatSpread(360);

    data[stride] = distance * Math.sin(theta) * Math.cos(phi);
    data[stride + 1] = distance * Math.sin(theta) * Math.sin(phi);
    data[stride + 2] = distance * Math.cos(theta);
    data[stride + 3] = 1.0; // this value will not have any impact
  }

  return data;
};

export default class SimMatShapeOne extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getRandomDataSphere(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );

    positionsTexture.needsUpdate = true;

    super({
      uniforms: {
        uPositions: { value: positionsTexture },
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

      uniform float uTime;
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uMaxDist;

      varying vec2 vUv;
      varying float vAlpha;
//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//

float hash( float n )
{
    return fract(sin(n)*43758.5453123);
}
float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0;

    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}

float fbm(vec2 pos) {
	float n = 0.;
	float scale = 1. / 1.5;
	for (int i = 0; i < 4; i += 1) {
		n += noise(pos) * scale;
		scale *= 0.5;
		pos *= 2.;
	}
	return n;
}

    void main() {
      vec2 uv = vUv;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      pos-= mod(uTime/30., 3.);
      float n = fbm(pos.xy *3. + vec2(2.)   +uTime );
      float n2 = fbm(pos.xy + vec2(n));

    //   pos*=n ;
      float n1 = fbm(vec2(pos.xz *15. + uTime *3.)) / 3.;
    //   pos+=n1 + n ;
      pos *= mix(n1, n2, uTime);
        // vec3 render = mix(pos, pos2, abs(sin(uTime*.075 * n)));
    //   float n2 = n * fbm(vec3(n  + uTime*0.025));
    //   pos.xz *= n + n1;
        // vec3 color = mix(pos, pos2, sin(uTime));
    //   pos.z *= sin(uTime);

      gl_FragColor = vec4( pos, 1. );

      }`,
    });
  }
}
