import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { useRef } from "react";
import {
  AdditiveBlending,
  // DoubleSide,
  ShaderMaterial,
} from "three";

import useInitFBOScene from "../../../../hooks/useInitFBOScene";
import useInitParticles from "../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../hooks/useInitRenderTarget";

import SimHeavyOne from "../shader/sim/SimMat";
import RenderHeavyOne from "../shader/render/RenderMat";
import PortalMesh from "../../../../components/PortalMesh";
import BufferParticles from "../../../../components/BufferParticles";

extend({
  SimHeavyOne: SimHeavyOne,
  RenderHeavyOne: RenderHeavyOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderHeavyOne: Object3DNode<RenderHeavyOne, typeof RenderHeavyOne>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simHeavyOne: Object3DNode<SimHeavyOne, typeof SimHeavyOne>;
  }
}

const HeavyOneFBO = () => {
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
        <simHeavyOne ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>

      <points>
        <renderHeavyOne
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

export default HeavyOneFBO;
