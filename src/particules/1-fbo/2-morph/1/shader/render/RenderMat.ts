import { ShaderMaterial } from "three";

export default class RenderMat extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uPositions: { value: null },
      },
      fragmentShader: /* glsl */ `

        varying float vDistance;
        varying vec3 vPos;

        void main() {        
           vec3 color = vec3(0.45,0.25,0.1);
      
          float dist = length(gl_PointCoord.xy - vec2(0.5)) *0.5;
          
          float angle = atan(vPos.x, vPos.y );
          float alpha = cos(angle ) * sin(angle ) * dist;
          
          dist = 1. - clamp(dist, 0.,1.);
          if(dist > 0.75) alpha = 0.25;

          gl_FragColor = vec4(color, alpha);
        }`,
      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        varying float vDistance;
        varying vec3 vPos;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          vPos = pos;
          vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.);
          vDistance = -mvPosition.z;
          gl_PointSize = 1. * (1./ -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

        }`,
    });
  }
}

// vec3 pos = texture2D(uPositions, position.xy).xyz;

// vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
// vec4 viewPosition = viewMatrix * modelPosition;
// vec4 projectedPosition = projectionMatrix * viewPosition;

// gl_Position = projectedPosition;

// gl_PointSize = 2.0;
// Size attenuation;
// gl_PointSize *= step(1.0 - (1.0/512.0), position.x) + 0.5;
