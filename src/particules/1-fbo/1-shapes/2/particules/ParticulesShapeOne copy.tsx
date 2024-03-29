import { useFBO, useTexture } from "@react-three/drei";
import {
  useFrame,
  createPortal,
  extend,
  Object3DNode,
} from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  // DoubleSide,
  FloatType,
  NearestFilter,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
} from "three";

import RenderMatShapeOne from "../shader/render/RenderMatShapeOne";
import SimMatShapeOne from "../shader/sim/SimMatShapeOne";
// import { getSphere } from "../../0-utils-shape-func/shapesFunction";
// import imgUrl from "./penrose.png";
// import imgUrl from "../../../../../assets/penrose.jpg";
// import { getPlane } from "../../0-utils-shape-func/shapesFunction";

extend({
  SimMatShapeOne: SimMatShapeOne,
  RenderMatShapeOne: RenderMatShapeOne,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMatShapeOne: Object3DNode<
      RenderMatShapeOne,
      typeof RenderMatShapeOne
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatShapeOne: Object3DNode<SimMatShapeOne, typeof SimMatShapeOne>;
  }
}

const ParticulesShapeOne = () => {
  const size = 512;
  // const dataRef = useRef<Float32Array>([])
  const texture = useTexture("/t.jpg");
  console.log(texture);

  const getImageData = () => {
    const { width, height } = texture.image;
    const w = width;
    const h = height;
    const canvas = document.createElement("canvas");
    canvas.height = h;
    canvas.width = w;
    const data = new Float32Array(width * height * 4);
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(texture.image, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h).data;

      for (let i = 0; i < data.length; i += 4) {
        const i3 = i * 3;
        const i4 = i * 4;

        // If it's not part of the background, extract data
        data[i3] = (i % width) - width * 0.5;
        data[i3 + 1] =
          ((imgData[i4] / 255) * 0.299 +
            (imgData[i4 + 1] / 255) * 0.587 +
            (imgData[i4 + 2] / 255) * 0.114) *
          64;
        data[i3 + 2] = Math.floor(i / width) - height * 0.5;
        data[i3 + 3] = 1;
      }
    }
    return data;
  };
  // const data = getPlane(size * size * 4, 1);

  const d = getImageData();
  console.log(d);

  //   for (let i = 0; i < len; i += 4) {
  //     const i3 = i * 3;
  //     const i4 = i * 4;
  //     data[i3] = (i % width) - width * 0.5;
  //     data[i3 + 1] =
  //       ((iData[i4] / 0xff) * 0.299 +
  //         (iData[i4 + 1] / 0xff) * 0.587 +
  //         (iData[i4 + 2] / 0xff) * 0.114) *
  //       elevation;
  //     data[i3 + 2] = i / width - height * 0.5;
  //     data[i3 + 3] = 1;
  //   }
  // var i3 = i * 3;
  // var i4 = i * 4;
  // data[i3] = ((i % width) / width - 0.5) * width; x
  // data[i3 + 1] =
  //   ((iData[i4] / 0xff) * 0.299 +
  //     (iData[i4 + 1] / 0xff) * 0.587 +
  //     (iData[i4 + 2] / 0xff) * 0.114) *
  //   elevation;
  // data[i3 + 2] = (i / width / height - 0.5) * height; y

  const simulationMaterialRef = useRef<ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<ShaderMaterial | null>(null);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
  });

  useFrame(state => {
    const { gl, clock } = state;
    // console.log(c.position);camera: c
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (renderMaterialRef.current){
      renderMaterialRef.current.uniforms.uPositions.value = target.texture;}
    // getDataImg();

    if (simulationMaterialRef.current)
      simulationMaterialRef.current.uniforms.uTime.value =
        clock.elapsedTime * 2;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simMatShapeOne ref={simulationMaterialRef} args={[size, d]} />
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
        </mesh>,
        scene
      )}
      <points>
        <renderMatShapeOne
          ref={renderMaterialRef}
          blending={AdditiveBlending}
          transparent={true}
          side={DoubleSide}
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

export default ParticulesShapeOne;
