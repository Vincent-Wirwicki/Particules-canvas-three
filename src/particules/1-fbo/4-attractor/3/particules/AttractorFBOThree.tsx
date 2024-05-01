import { useFrame, extend, Object3DNode, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitFBOScene from "../../../../../hooks/useInitFBOScene";

import PortalMesh from "../../../../../components/PortalMesh";
import BufferParticles from "../../../../../components/BufferParticles";

import RenderMatAttractThree from "../shader/render/RenderMatAttractorThree";
import SimMatAttractThree from "../shader/sim/SimMatAttractorThree";

extend({
  SimMatAttractThree: SimMatAttractThree,
  RenderMatAttractThree: RenderMatAttractThree,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatAttractThree: Object3DNode<
      RenderMatAttractThree,
      typeof RenderMatAttractThree
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatAttractThree: Object3DNode<
      SimMatAttractThree,
      typeof SimMatAttractThree
    >;
  }
}

const AttractorFBOThree = () => {
  const size = 512;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const { scene, camera, positions, uvs } = useInitFBOScene();
  const particles = useInitParticles(size);

  let target = useInitRenderTarget(size);
  let target1 = target.clone();

  const state = useThree();

  useLayoutEffect(() => {
    const { gl } = state;
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.compile(scene, camera);
  });

  //reload on resize or the render dispear
  useEffect(() => {
    const onResize = () => location.reload();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  useFrame(state => {
    const { gl, clock } = state;

    if (simulationMaterialRef.current) {
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
      simulationMaterialRef.current.uniforms.uPositions.value = target.texture;
    }

    if (renderMaterialRef.current) {
      renderMaterialRef.current.uniforms.uPositions.value = target1.texture;
      renderMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }

    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    //swap texture
    const temp = target;
    target = target1;
    target1 = temp;
  });

  return (
    <>
      <PortalMesh uvs={uvs} positions={positions} scene={scene}>
        <simMatAttractThree ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>
      <BufferParticles particles={particles} />
      <points>
        <renderMatAttractThree
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          depthWrite={false}
          // transparent={true}
          // side={DoubleSide}
        />
        <BufferParticles particles={particles} />
      </points>
    </>
  );
};

export default AttractorFBOThree;
