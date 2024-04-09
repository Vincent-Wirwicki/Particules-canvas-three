import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import useInitFBOScene from "../../../../../hooks/useInitFBOScene";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../../components/BufferParticles";
import PortalMesh from "../../../../../components/PortalMesh";

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

  const { scene, camera, positions, uvs } = useInitFBOScene();
  const particles = useInitParticles(size);
  const target = useInitRenderTarget(size);

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
      <PortalMesh uvs={uvs} positions={positions} scene={scene}>
        <simMatMorphOne ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>

      <points>
        <renderMatMorphOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          // side={DoubleSide}
          depthTest={true}
        />
        <BufferParticles particles={particles} />
      </points>
    </>
  );
};

export default MorphOneFBO;
