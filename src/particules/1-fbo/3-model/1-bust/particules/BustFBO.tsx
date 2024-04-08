import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { AdditiveBlending, Mesh, ShaderMaterial } from "three";
import { Preload, useGLTF } from "@react-three/drei";
import { useRef } from "react";

import useInitFBO from "../../../../../hooks/useInitFBO";
import useInitParticles from "../../../../../hooks/useInitParticles";
import useInitRenderTarget from "../../../../../hooks/useInitRenderTarget";

import BufferParticles from "../../../../../components/BufferParticles";
import PortalMesh from "../../../../../components/PortalMesh";

import SimMatBust from "../shader/sim/SimMat";
import RenderMatBust from "../shader/render/RenderMat";

extend({
  SimMatBust: SimMatBust,
  RenderMatBust: RenderMatBust,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatBust: Object3DNode<RenderMatBust, typeof RenderMatBust>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatBust: Object3DNode<SimMatBust, typeof SimMatBust>;
  }
}

const BustFBO = () => {
  const size = 512;
  const model = useGLTF("/bust-hi.glb");

  const getDataModel = (numPoints: number) => {
    const size = numPoints * numPoints * 4;
    const data = new Float32Array(size);
    const mesh = model.nodes.Mesh_0001 as Mesh;

    const pos = mesh.geometry.attributes.position.array;
    const total = pos.length / 3;

    for (let i = 0; i < size; i++) {
      const stride = i * 4;

      const random = Math.floor(Math.random() * total);
      const x = pos[3 * random];
      const y = pos[3 * random + 1];
      const z = pos[3 * random + 2];

      data[stride] = x;
      data[stride + 1] = y;
      data[stride + 2] = z;
      data[stride + 3] = 1;
    }

    return data;
  };

  const data = getDataModel(size);

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
        <simMatBust ref={simulationMaterialRef} args={[size, data]} />
      </PortalMesh>
      <points>
        <renderMatBust
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          depthTest={false}
          // side={DoubleSide}
        />
        <BufferParticles particles={particles} />
      </points>
      <Preload />
    </>
  );
};

export default BustFBO;
