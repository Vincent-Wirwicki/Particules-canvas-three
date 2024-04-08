import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import useInitFBO from "../../../../../hooks/useInitFBO";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../../components/BufferParticles";
import PortalMesh from "../../../../../components/PortalMesh";

import SimLabOne from "../shader/sim/SimMat";
import RenderLabOne from "../shader/render/RenderMat";

extend({
  SimLabOne: SimLabOne,
  RenderLabOne: RenderLabOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderLabOne: Object3DNode<RenderLabOne, typeof RenderLabOne>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simLabOne: Object3DNode<SimLabOne, typeof SimLabOne>;
  }
}

const LabOneRenderFBO = () => {
  const size = 512;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const { scene, camera, positions, uvs } = useInitFBO();
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
        <simLabOne ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>
      <points>
        <renderLabOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          depthTest={false}
          // side={DoubleSide}
        />
        <BufferParticles particles={particles} />
      </points>
    </>
  );
};

export default LabOneRenderFBO;
