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
        void main() {        
          // gl_FragColor = vec4(vec3(0.8),.8);
          float dist = length(gl_PointCoord - vec2(0.5));
        //   float alpha = 1. - smoothstep(0.,1., 1.- vDistance);

        //   dark matter render
        //   vec3 color = vec3(1.,0.25,.5);
        //   color = smoothstep(vec3(.75),vec3(1.),vec3(vDistance, 0. ,0.));

            vec3 color = vec3(0.15);
        //   color = smoothstep(vec3(.15),vec3(.5),vec3(dist));

          //reddish with blacks more blends
          color = smoothstep(vec3(.75),vec3(.5),vec3(0.5));
          gl_FragColor = vec4(color,1.);
        }`,
      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        uniform float uDotSize;
        varying float vSize;
        varying float vDistance;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
          vDistance = -mvPosition.z;
          gl_PointSize = 10. * (1./ -mvPosition.z);
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
