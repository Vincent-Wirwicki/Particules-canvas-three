export const TerrainParticulesFragment = /*glsl*/ `
    uniform float uTime;
    varying float vDistance;

    void main() {
      //make particules circles
      float dist = length(gl_PointCoord - vec2(0.5));
      float alpha = 1. - smoothstep(0.4,0.5, dist);
      // bluesh
      // vec3 colorB = vec3(0.000,0.101,1.000);
      // vec3 colorA = vec3(0.266,0.990,0.943);

      vec3 colorA = vec3(0.000,0.289,0.912);
      vec3 colorB = vec3(1.000,0.010,0.000);
      

      float t = (vDistance + 1.0) * 0.5;
      vec3 color = mix(colorA, colorB, t );

      gl_FragColor = vec4(color, alpha);
    }
  `;
