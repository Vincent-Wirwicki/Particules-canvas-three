import { useFrame, extend, Object3DNode, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitFBOScene from "../../../../../hooks/useInitFBOScene";

import PortalMesh from "../../../../../components/PortalMesh";
import BufferParticles from "../../../../../components/BufferParticles";

import RenderMatAttractTwo from "../shader/render/RenderMatShapeOne";
import SimMatAttractTwo from "../shader/sim/SimMatShapeOne";
import { getTorusWeird } from "../../../../0-dataShape/getTorusKnot";

extend({
  SimMatAttractTwo: SimMatAttractTwo,
  RenderMatAttractTwo: RenderMatAttractTwo,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatAttractTwo: Object3DNode<
      RenderMatAttractTwo,
      typeof RenderMatAttractTwo
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatAttractTwo: Object3DNode<SimMatAttractTwo, typeof SimMatAttractTwo>;
  }
}

const AttractorFBOTwo = () => {
  const size = 512;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const { scene, camera, positions, uvs } = useInitFBOScene();
  const particles = useInitParticles(size);

  const dataShape = getTorusWeird(size, 2, 3, 1);

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
        <simMatAttractTwo
          ref={simulationMaterialRef}
          args={[size, dataShape]}
        />
      </PortalMesh>
      <BufferParticles particles={particles} />
      <points>
        <renderMatAttractTwo
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

export default AttractorFBOTwo;
