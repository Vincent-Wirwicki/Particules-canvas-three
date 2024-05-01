import { useFrame, extend, Object3DNode, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import RenderTwo from "../shader/render/RenderMatShapeOne";
import SimMatShapeOne from "../shader/sim/SimMatShapeOne";
import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitFBOScene from "../../../../../hooks/useInitFBOScene";
import PortalMesh from "../../../../../components/PortalMesh";
import BufferParticles from "../../../../../components/BufferParticles";

extend({
  SimMatShapeOne: SimMatShapeOne,
  RenderTwo: RenderTwo,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderTwo: Object3DNode<RenderTwo, typeof RenderTwo>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatShapeOne: Object3DNode<SimMatShapeOne, typeof SimMatShapeOne>;
  }
}

const LabTwoRenderFBO = () => {
  const size = 512;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const { scene, camera, positions, uvs } = useInitFBOScene();
  const particles = useInitParticles(size);
  let target = useInitRenderTarget(size);
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

  useEffect(() => {
    const onResize = () => location.reload();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  useFrame(state => {
    const { gl, clock, camera: c } = state;
    console.log(c.position);
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
      <PortalMesh uvs={uvs} positions={positions} scene={scene}>
        <simMatShapeOne ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>

      <points>
        <renderTwo
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          depthWrite={false}
          transparent={false}
          // side={DoubleSide}
        />
        <BufferParticles particles={particles} />
      </points>
    </>
  );
};

export default LabTwoRenderFBO;
