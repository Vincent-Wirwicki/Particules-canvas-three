import { ShaderMaterial } from "three";

export default class RenderMat extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uPositions: { value: null },
      },
      fragmentShader: /* glsl */ `
 
        varying float vSize;
        varying float vDistance;
        varying vec3 vPos;

        void main() {        
          // gl_FragColor = vec4(vec3(0.8),.8);
           vec3 color = vec3(0.45,0.25,0.1);
      
          float dist = length(gl_PointCoord.xy - vec2(0.5));
                    dist = 1. - clamp(dist, 0.,1.);

          float angle = atan(vPos.x, vPos.y );
          float alpha = cos(angle ) * sin(angle ) * dist;
          
          if(dist > 0.5) alpha = 0.5;

          gl_FragColor = vec4(color, alpha);
        }`,
      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        uniform float uDotSize;
        varying float vSize;
        varying float vDistance;
        varying vec3 vPos;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          vPos = pos;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
          vDistance = -mvPosition.z;
          gl_PointSize = 1. * (1./ -mvPosition.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1. );

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
