import { ShaderMaterial } from "three";

export default class RenderMatShapeOne extends ShaderMaterial {
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
        varying float vAlpha;


        void main() {        
          // gl_FragColor = vec4(vec3(0.8),.8);
          float dist = length(gl_PointCoord.xy - vec2(0.5)) *0.5;
          // float dist = length(vDistance - vec2(0.5));

          // vec3 color = vec3(0.15,0.45,0.75);
          vec3 color = vec3(0.45,0.25,0.1);
          // vec3 color = vec3(1.);

          // float alpha = cos(angle ) * sin(angle ) * dist;
           float alpha = .5*(0.5-0.45*sin(vAlpha - sin(uTime*1.25) ));

          // dist = 1. - clamp(dist, 0.,1.);
          // if(dist > 0.85) alpha =0.15;
          // if(t < 0.25) alpha = 0.;
          // vec2 a = vUv - 0.5 ;
          gl_FragColor = vec4(vec3(color), 0.75);
        }`,
      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        varying float vDistance;
        varying vec2 vUv;
        varying float vAlpha;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          vAlpha = atan(pos.x,pos.y);
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.);
          vDistance = -mvPosition.z;
          gl_PointSize = 4. * (1./ -mvPosition.z);
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
