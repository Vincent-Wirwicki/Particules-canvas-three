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

        //----------------------------------------------------------------------------------------
    vec3 HashALU(in vec3 p, in float numCells)
    {
    	// This is tiling part, adjusts with the scale
    	p = mod(p, numCells);
    
        p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
    			  dot(p,vec3(269.5,183.3,246.1)),
    			  dot(p,vec3(113.5,271.9,124.6)));
    
    	return -1.0 + fract(sin(p)*43758.5453123) * 2.0;
    }
    
    #define Hash HashALU
    
    //----------------------------------------------------------------------------------------
    float TileableNoise(in vec3 p, in float numCells )
    {
    	vec3 f, i;
    
    	p *= numCells;
    
    
    	f = fract(p);		// Separate integer from fractional
        i = floor(p);
    
        vec3 u = f*f*(3.0-2.0*f); // Cosine interpolation approximation
    
        return mix( mix( mix( dot( Hash( i + vec3(0.0,0.0,0.0), numCells ), f - vec3(0.0,0.0,0.0) ), 
                              dot( Hash( i + vec3(1.0,0.0,0.0), numCells ), f - vec3(1.0,0.0,0.0) ), u.x),
                         mix( dot( Hash( i + vec3(0.0,1.0,0.0), numCells ), f - vec3(0.0,1.0,0.0) ), 
                              dot( Hash( i + vec3(1.0,1.0,0.0), numCells ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                    mix( mix( dot( Hash( i + vec3(0.0,0.0,1.0), numCells ), f - vec3(0.0,0.0,1.0) ), 
                              dot( Hash( i + vec3(1.0,0.0,1.0), numCells ), f - vec3(1.0,0.0,1.0) ), u.x),
                         mix( dot( Hash( i + vec3(0.0,1.0,1.0), numCells ), f - vec3(0.0,1.0,1.0) ), 
                              dot( Hash( i + vec3(1.0,1.0,1.0), numCells ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
    }
    
    float TileableNoiseFBM(in vec3 p, float numCells, int octaves)
    {
    	float f = 0.0;
        
    	// Change starting scale to any integer value...
        p = mod(p, vec3(numCells));
    	float amp = 0.5;
        float sum = 0.0;
    
    	for (int i = 0; i < octaves; i++)
    	{
    		f += TileableNoise(p, numCells) * amp;
            sum += amp;
    		amp *= 0.5;
      
    		// numCells must be multiplied by an integer value...
    		numCells *= 2.0;
    	}
    
    	return f / sum;
    }
    
    vec3 snoiseVec3( vec3 x )
    {
      float numCells = 6.0;
      int octaves = 3;
       
      float s  = TileableNoiseFBM(vec3( x ), numCells, octaves);
      float s1 = TileableNoiseFBM(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ), numCells, octaves);
      float s2 = TileableNoiseFBM(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ), numCells, octaves);
      vec3 c = vec3( s , s1 , s2 );
      return c;
    
    }
    
    vec3 curlNoise(vec3 p)
    {
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
    
        //-------------------------------------------------------------------------
    
    void main() {
      vec2 uv = vUv;
      vec3 pos = texture2D( uPositions, uv ).xyz;
      
      const float amp = 0.5;
      const float freq = 0.15;

      pos+= curlNoise(pos * freq + uTime *0.01)* amp;
      pos.xy = rotate(pos.xy, 0.5);
      
      gl_FragColor = vec4(pos, 1.);

      }`,
    });
  }
}
