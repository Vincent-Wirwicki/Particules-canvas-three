import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";

// const m = useGLTF("./public/bust-hi.glb");
export default class SimMatModel extends ShaderMaterial {
  constructor(size: number, data: Float32Array) {
    const positionsTexture = new DataTexture(
      data,
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
        varying float vAlpha;

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

    //-------------------------------------------------------------------------
    // Description : Array and textureless GLSL 2D simplex noise function.
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

    vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec3 permute(vec3 x) {
        return mod289(((x*34.0)+1.0)*x);
    }

    float noise(vec2 v)
    {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
        // First corner
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
    
        // Other corners
        vec2 i1;
        //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
        //i1.y = 1.0 - i1.x;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        // x0 = x0 - 0.0 + 0.0 * C.xx ;
        // x1 = x0 - i1 + 1.0 * C.xx ;
        // x2 = x0 - 1.0 + 2.0 * C.xx ;
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
    
        // Permutations
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
    
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
    
        // Gradients: 41 points uniformly over a line, mapped onto a diamond.
        // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
    
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
    
        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    
        // Compute final noise value at P
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    vec3 curl(float	x,	float	y,	float	z)
    {
    
        float	eps	= 1., eps2 = 2. * eps;
        float	n1,	n2,	a,	b;
    
        x += uTime * .05;
        y += uTime * .05;
        z += uTime * .05;
    
        vec3	curl = vec3(0.);
    
        n1	=	noise(vec2( x,	y	+	eps ));
        n2	=	noise(vec2( x,	y	-	eps ));
        a	=	(n1	-	n2)/eps2;
    
        n1	=	noise(vec2( x,	z	+	eps));
        n2	=	noise(vec2( x,	z	-	eps));
        b	=	(n1	-	n2)/eps2;
    
        curl.x	=	a	-	b;
    
        n1	=	noise(vec2( y,	z	+	eps));
        n2	=	noise(vec2( y,	z	-	eps));
        a	=	(n1	-	n2)/eps2;
    
        n1	=	noise(vec2( x	+	eps,	z));
        n2	=	noise(vec2( x	+	eps,	z));
        b	=	(n1	-	n2)/eps2;
    
        curl.y	=	a	-	b;
    
        n1	=	noise(vec2( x	+	eps,	y));
        n2	=	noise(vec2( x	-	eps,	y));
        a	=	(n1	-	n2)/eps2;
    
        n1	=	noise(vec2(  y	+	eps,	z));
        n2	=	noise(vec2(  y	-	eps,	z));
        b	=	(n1	-	n2)/eps2;
    
        curl.z	=	a	-	b;
    
        return	curl;
    }
        //-------------------------------------------------------------------------

        
    vec3 fbm(vec3 p, float amp, float freq){
      vec3 value =vec3(0.);
      float ampScale = 0.5; 
      float freqScale = 2.;
      int octaves = 3;
    
      for (int i = 0; i < octaves; i++) {
        value +=  curl(p.x * freq, p.y*freq, p.z*freq) * amp ;
        p.xy += rotate(p.xy, freq);
        freq*= freqScale;
        amp*= ampScale;
      } 
      return value;
    }

    void main() {
      vec2 uv = vUv;
      vec3 pos = texture2D( uPositions, uv ).xyz;

      const float amp = 20.;
      const float freq = .75;
      const float dist = .015;
      
      vec3 disp;
      disp += fbm(pos, amp, freq);

      float d = length(pos-disp) * dist;
      pos = mix( pos, disp, pow( d, 5. ) );

      pos.xz = rotate(pos.xz, uTime *0.15 );

      pos.x = pos.x + .25;
      pos.y = pos.y - 2.75;
      pos.z = pos.z - 3.75;

      gl_FragColor = vec4( pos, 1. );

      }`,
    });
  }
}
