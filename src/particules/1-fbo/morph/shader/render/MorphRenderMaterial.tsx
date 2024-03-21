import { ShaderMaterial } from "three";

export default class MorphRenderMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: { uPositions: { value: null } },
      fragmentShader: /* glsl */ `
      varying vec4 vColor;
      void main() {
        // vec3 red = vec3(0.770,0.162,0.176) ;
         gl_FragColor = vec4(vec3( .5 ),1.);
        }`,
      vertexShader: /*glsl */ `
      uniform sampler2D uPositions;
      
      void main() {
      
      //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
        vec3 pos = texture2D( uPositions, position.xy ).xyz;

      //pos now contains the position of a point in space taht can be transformed
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

        gl_PointSize = 2.0;
        // Size attenuation;
        // gl_PointSize *= step(1.0 - (1.0/256.0), position.x) + 0.5;
      }`,
    });
  }
}
