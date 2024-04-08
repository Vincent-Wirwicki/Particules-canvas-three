import { useFrame, extend, Object3DNode, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending, ShaderMaterial, Vector3 } from "three";

import useInitFBO from "../../../../hooks/useInitFBO";
import useInitParticles from "../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../components/BufferParticles";
import PortalMesh from "../../../../components/PortalMesh";

import RenderMatMouseOne from "../shader/render/RenderMatShapeOne";
import SimMatMouseOne from "../shader/sim/SimMatShapeOne";

extend({
  SimMatMouseOne: SimMatMouseOne,
  RenderMatMouseOne: RenderMatMouseOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatMouseOne: Object3DNode<
      RenderMatMouseOne,
      typeof RenderMatMouseOne
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatMouseOne: Object3DNode<SimMatMouseOne, typeof SimMatMouseOne>;
  }
}

const MouseFBOOne = () => {
  const size = 256;

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const { scene, camera, positions, uvs } = useInitFBO();
  const particles = useInitParticles(size);
  let target = useInitRenderTarget(size);

  let target1 = target.clone();

  const state = useThree();
  // init render target
  useEffect(() => {
    const { gl } = state;
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.compile(scene, camera);
    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });
  // reload on resize or the render dispear
  useEffect(() => {
    const onResize = () => location.reload();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  useFrame(state => {
    const { gl, clock, raycaster, pointer } = state;

    raycaster.setFromCamera(pointer, camera);
    if (simulationMaterialRef.current) {
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
      simulationMaterialRef.current.uniforms.uPositions.value = target.texture;

      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects)
        simulationMaterialRef.current.uniforms.uMouse.value = new Vector3(
          pointer.x,
          pointer.y,
          0
        );
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
        <simMatMouseOne ref={simulationMaterialRef} args={[size]} />
      </PortalMesh>
      <points>
        <renderMatMouseOne
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

export default MouseFBOOne;
