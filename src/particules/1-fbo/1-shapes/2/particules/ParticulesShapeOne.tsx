import { useFBO } from "@react-three/drei";
import {
  useFrame,
  createPortal,
  extend,
  Object3DNode,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  FloatType,
  NearestFilter,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
} from "three";

import RenderMatShapeOne from "../shader/render/RenderMatShapeOne";
import SimMatShapeOne from "../shader/sim/SimMatShapeOne";

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
  const size = 512;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

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

  let target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    stencilBuffer: false,
    type: FloatType,
  });

  let target1 = target.clone();

  const state = useThree();

  useEffect(() => {
    const { gl } = state;
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  useFrame(state => {
    const { gl, clock } = state;

    if (simulationMaterialRef.current) {
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
      simulationMaterialRef.current.uniforms.uPositions.value = target.texture;
    }

    if (renderMaterialRef.current) {
      renderMaterialRef.current.uniforms.uPositions.value = target1.texture;
    }
    // console.log(c.position);camera: c
    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    const temp = target;
    target = target1;
    target1 = temp;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simMatShapeOne ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points>
        <renderMatShapeOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          depthWrite={false}
          // transparent={true}
          // side={DoubleSide}
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
