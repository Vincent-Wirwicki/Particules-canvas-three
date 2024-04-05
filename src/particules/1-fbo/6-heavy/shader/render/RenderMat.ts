import { ShaderMaterial, Vector2 } from "three";

export default class RenderMatCurlTwo extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uPositions: { value: null },
        uRes: { value: new Vector2(512) },
        uTime: { value: 0 },
      },
      fragmentShader: /* glsl */ `

        uniform float uTime;
        uniform vec2 uRes;
        varying float vDistance;
        varying vec2 vUv;
        varying vec3 vPos;


        void main() {  
          
          vec3 color = vec3(0.45,0.25,0.1);
          // vec3 color = vec3(0.,0.,1.);
          float dist = length(gl_PointCoord.xy - vec2(0.5));
          // dist = 1.05 - clamp(dist, 0.,1.);

          // float a = uv * dist;
          float angle = atan(vPos.x, vPos.y );
          float alpha =  sin(angle ) * dist;
          
          // if(dist > 0.15) alpha = 0.75;

          gl_FragColor = vec4(color,1.);
        }`,
      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        varying vec3 vPos;
        varying float vDistance;
        varying vec2 vUv;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          vPos = position;
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.);
          vDistance = -mvPosition.z;
          gl_PointSize = 5. * (1./ -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

        }`,
    });
  }
}
