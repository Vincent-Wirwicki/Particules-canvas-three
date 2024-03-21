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
  FloatType,
  NearestFilter,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
} from "three";

import useLoadImage from "../hook/useLoadImage";
import perlinNoise from "../../../../../assets/noise/perlinNoise.png";

import MorphRenderMaterial from "../shader/render/MorphRenderMaterial";
import MorphSimulationMaterial from "../shader/simulation/MorphSimulationMaterial";

extend({
  MorphRenderMaterial: MorphRenderMaterial,
  MorphSimulationMaterial: MorphSimulationMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    morphRenderMaterial: Object3DNode<
      MorphRenderMaterial,
      typeof MorphRenderMaterial
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    morphSimulationMaterial: Object3DNode<
      MorphSimulationMaterial,
      typeof MorphSimulationMaterial
    >;
  }
}

const MorphParticulesFBO = () => {
  const size = 256;
  const { imgData } = useLoadImage(perlinNoise);
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

    if (renderMaterialRef.current) {
      renderMaterialRef.current.uniforms.uPositions.value = target.texture;
    }

    if (simulationMaterialRef.current)
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });
  // console.log(imgData);
  if (!imgData) return console.warn(" noise not loading");

  return (
    <>
      {createPortal(
        <mesh>
          <morphSimulationMaterial
            ref={simulationMaterialRef}
            args={[imgData.data, imgData.height, imgData.width]}
          />
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
        <morphRenderMaterial
          ref={renderMaterialRef}
          blending={AdditiveBlending}
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

export default MorphParticulesFBO;
