import { DataTexture, FloatType, RGBAFormat, ShaderMaterial } from "three";
// import plrnNoise from "../../../../../../assets/noise/perlinNoise.png";

export default class MorphSimulationMaterial extends ShaderMaterial {
  constructor(
    // img: HTMLImageElement,
    data: Float32Array | null | undefined,
    width: number,
    height: number
  ) {
    const positionTexture = new DataTexture(
      data,
      width,
      height,
      RGBAFormat,
      FloatType
    );

    positionTexture.needsUpdate = true;

    super({
      uniforms: {
        uTime: { value: 0 },
        uPositions: {
          value: positionTexture,
        },
      },

      fragmentShader: /*glsl */ `
      uniform sampler2D uPositions;
      varying vec2 vUv;
      void main() {
          vec3 pos = texture2D( uPositions, vUv ).rgb;
          gl_FragColor = vec4( pos,1.0 );
      }`,

      vertexShader: /*glsl */ `
      varying vec2 vUv;
      void main() {
          vUv = vec2(uv.x, uv.y);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
    });
  }
}