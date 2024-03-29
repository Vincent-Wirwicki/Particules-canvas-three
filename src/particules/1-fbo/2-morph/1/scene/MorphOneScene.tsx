import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticulesShapeOne from "../particules/MorphOneFBO";

const MorphOneScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 18, -1] }} dpr={1.25}>
        <ParticulesShapeOne />
      </Canvas>
    </Suspense>
  );
};

export default MorphOneScene;
