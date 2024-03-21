import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { Suspense } from "react";
import ParticulesShapeOne from "../particules/FBMOneParticules";

const FBMOneScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 18, 0] }}>
        <ParticulesShapeOne />
        <Preload />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default FBMOneScene;
