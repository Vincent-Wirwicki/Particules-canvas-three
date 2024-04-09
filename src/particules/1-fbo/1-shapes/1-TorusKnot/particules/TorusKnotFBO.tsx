import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { useRef } from "react";
import {
  AdditiveBlending,
  // DoubleSide,
  ShaderMaterial,
} from "three";

import SimTorusKnot from "../shader/sim/SimMat";
import RenderTorusKnot from "../shader/render/RenderMat";

import useInitFBOScene from "../../../../../hooks/useInitFBOScene";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../../components/BufferParticles";
import PortalMesh from "../../../../../components/PortalMesh";

extend({
  SimTorusKnot: SimTorusKnot,
  RenderTorusKnot: RenderTorusKnot,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderTorusKnot: Object3DNode<RenderTorusKnot, typeof RenderTorusKnot>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simTorusKnot: Object3DNode<SimTorusKnot, typeof SimTorusKnot>;
  }
}

const TorusKnotFBO = () => {
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
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      <PortalMesh uvs={uvs} positions={positions} scene={scene}>
        <simTorusKnot ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>
      <points>
        <renderTorusKnot
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

export default TorusKnotFBO;
