import { useFrame, extend, Object3DNode, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import useInitFBOScene from "../../../../../hooks/useInitFBOScene";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../../components/BufferParticles";
import PortalMesh from "../../../../../components/PortalMesh";

import RenderMatAttractOne from "../shader/render/RenderMatShapeOne";
import SimMatAttractOne from "../shader/sim/SimMatShapeOne";

extend({
  SimMatAttractOne: SimMatAttractOne,
  RenderMatAttractOne: RenderMatAttractOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatAttractOne: Object3DNode<
      RenderMatAttractOne,
      typeof RenderMatAttractOne
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatAttractOne: Object3DNode<SimMatAttractOne, typeof SimMatAttractOne>;
  }
}

const AttractorFBOOne = () => {
  const size = 256;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const { scene, camera, positions, uvs } = useInitFBOScene();
  const particles = useInitParticles(size);

  let target = useInitRenderTarget(size);
  let target1 = target.clone();

  const state = useThree();

  //init render scene
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
        <simMatAttractOne ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>
      <points>
        <renderMatAttractOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          depthWrite={false}
          transparent={true}
          // side={DoubleSide}
        />
        <BufferParticles particles={particles} />
      </points>
    </>
  );
};

export default AttractorFBOOne;
