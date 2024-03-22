import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { Suspense } from "react";
import ParticulesShapeOne from "../particules/ParticulesShapeOne";

const ParticulesShapeOneScene = () => {
  return (
    <Canvas camera={{ position: [2.7, 9, 3.5] }}>
      <Suspense fallback={null}>
        <ParticulesShapeOne />
      </Suspense>
      <Preload />
      <OrbitControls />
    </Canvas>
  );
};

export default ParticulesShapeOneScene;
