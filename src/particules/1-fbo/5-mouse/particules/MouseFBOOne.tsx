import { useFBO } from "@react-three/drei";
import {
  useFrame,
  createPortal,
  extend,
  Object3DNode,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  FloatType,
  NearestFilter,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector3,
} from "three";

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

  const [scene] = useState(() => new Scene());
  const [camera] = useState(() => new OrthographicCamera(-1, 1, 1, -1, -1, 1));
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
      // particles[i3 + 3] = 0;
    }
    return particles;
  }, [size]);

  let target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    stencilBuffer: false,
    type: FloatType,
  });

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
      {createPortal(
        <>
          <mesh>
            <simMatMouseOne ref={simulationMaterialRef} args={[size]} />
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={positions.length / 3}
                array={positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-uv"
                count={uvs.length / 2}
                array={uvs}
                itemSize={2}
              />
            </bufferGeometry>
          </mesh>
        </>,
        scene
      )}
      <points>
        <renderMatMouseOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          depthWrite={false}
          transparent={true}
          // side={DoubleSide}
        />
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </>
  );
};

export default MouseFBOOne;
