import { ShaderMaterial } from "three";

export default class RenderMat extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uPositions: { value: null },
        uTime: { value: 0 },
      },
      fragmentShader: /* glsl */ `

        uniform float uTime;
        varying float vDistance;
        varying vec2 vUv;
        varying vec3 vPos;


        void main() {        
          // gl_FragColor = vec4(vec3(0.8),.8);
          float dist = length(gl_PointCoord - 0.5);
          float angle = atan(vPos.x, vPos.y );
          float alpha = cos(angle ) * sin(angle ) * dist;
          vec3 color = vec3(0.45,0.25,0.1);
          // color = vec3(alpha);
          dist = 1. - clamp(dist *1.5, 0.,1.);
          if(dist> 0.65) alpha = 0.1;
          gl_FragColor = vec4(color,alpha );

          // vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          // if (dot(cxy, cxy) > 1.1) discard;
          // gl_FragColor = vec4(color, (1.07 - clamp(vDistance * 1.5, 0.0, 1.0)));
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
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
          vDistance = -mvPosition.z;

          gl_PointSize = 2. * (1./ -mvPosition.z);

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
