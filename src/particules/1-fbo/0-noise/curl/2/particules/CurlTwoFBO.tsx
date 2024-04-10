import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import useInitFBOScene from "../../../../../../hooks/useInitFBOScene";
import useInitParticles from "../../../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../../../components/BufferParticles";
import PortalMesh from "../../../../../../components/PortalMesh";

import SimMatCurlTwo from "../shader/sim/SimMat";
import RenderMatCurlTwo from "../shader/render/RenderMat";

extend({
  SimMatCurlTwo: SimMatCurlTwo,
  RenderMatCurlTwo: RenderMatCurlTwo,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatCurlTwo: Object3DNode<RenderMatCurlTwo, typeof RenderMatCurlTwo>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatCurlTwo: Object3DNode<SimMatCurlTwo, typeof SimMatCurlTwo>;
  }
}

const CurlTwoFBO = () => {
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
        <simMatCurlTwo ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>
      <points>
        <renderMatCurlTwo
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          depthTest={false}
        />
        <BufferParticles particles={particles} />
      </points>
    </>
  );
};

export default CurlTwoFBO;
