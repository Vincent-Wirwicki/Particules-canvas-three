import { useFBO } from "@react-three/drei";
import {
  useFrame,
  createPortal,
  extend,
  Object3DNode,
} from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  DataTexture,
  DoubleSide,
  // DoubleSide,
  FloatType,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
} from "three";

import RenderMatShapeOne from "../shader/render/RenderMatShapeOne";
import SimMatShapeOne from "../shader/sim/SimMatShapeOne";
import { getPlane } from "../../0-utils-shape-func/shapesFunction";

extend({
  SimMatShapeOne: SimMatShapeOne,
  RenderMatShapeOne: RenderMatShapeOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatShapeOne: Object3DNode<
      RenderMatShapeOne,
      typeof RenderMatShapeOne
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatShapeOne: Object3DNode<SimMatShapeOne, typeof SimMatShapeOne>;
  }
}

const ParticulesShapeOne = () => {
  const size = 128;

  const data = getPlane(size, 1);

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const scene = new Scene();
  // const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);

  const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, 0);

  const FBOTexture = new DataTexture(data, size, size, RGBAFormat, FloatType);
  FBOTexture.needsUpdate = true;
  const FBOgeometry = new PlaneGeometry(2, 2);
  const FBOMat = new ShaderMaterial({
    uniforms: {
      uPositions: { value: FBOTexture },
      uTime: { value: 0 },
    },
    fragmentShader: /*glsl */ `
      uniform sampler2D uPositions;
      uniform float uTime;
      varying vec2 vUv;     
    
    void main() {
      vec2 uv = vUv;   
      vec3 pos = texture2D( uPositions, uv ).xyz;
      gl_FragColor = vec4( uv, 1., 1. );

      }`,
    vertexShader: /*glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position,1. );
      }`,
  });

  const FBOmesh = new Mesh(FBOgeometry, FBOMat);
  scene.add(FBOmesh);

  // const positions = new Float32Array([
  //   -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  // ]);
  // const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
  });

  useFrame(state => {
    const { gl, clock } = state;
    // console.log(c.position);camera: c
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (renderMaterialRef.current) {
      renderMaterialRef.current.uniforms.uPositions.value = target.texture;
    }
    // getDataImg();

    if (simulationMaterialRef.current)
      simulationMaterialRef.current.uniforms.uTime.value =
        clock.elapsedTime * 2;
  });

  return (
    <>
      {createPortal(<primitive object={FBOmesh} />, scene)}
      <planeGeometry args={[1, 1]} />
      <points>
        <renderMatShapeOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          side={DoubleSide}
        />
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </>
  );
};

export default ParticulesShapeOne;
