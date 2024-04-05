import { useFBO } from "@react-three/drei";
import {
  useFrame,
  createPortal,
  extend,
  Object3DNode,
} from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  // DoubleSide,
  FloatType,
  NearestFilter,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
} from "three";

import RenderMatMorphOne from "../shader/render/RenderMat";
import SimMatMorphOne from "../shader/sim/SimMat";

extend({
  SimMatMorphOne: SimMatMorphOne,
  RenderMatMorphOne: RenderMatMorphOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatMorphOne: Object3DNode<
      RenderMatMorphOne,
      typeof RenderMatMorphOne
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatMorphOne: Object3DNode<SimMatMorphOne, typeof SimMatMorphOne>;
  }
}
const MorphOneFBO = () => {
  const size = 512;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const [scene] = useState(() => new Scene());
  const [camera] = useState(() => new OrthographicCamera(-1, 1, 1, -1, -1, 1));
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );

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

    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (renderMaterialRef.current)
      renderMaterialRef.current.uniforms.uPositions.value = target.texture;

    if (simulationMaterialRef.current)
      simulationMaterialRef.current.uniforms.uTime.value =
        clock.elapsedTime * 2;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simMatMorphOne ref={simulationMaterialRef} args={[size]} />
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
        <renderMatMorphOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          // side={DoubleSide}
          depthTest={true}
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

export default MorphOneFBO;
