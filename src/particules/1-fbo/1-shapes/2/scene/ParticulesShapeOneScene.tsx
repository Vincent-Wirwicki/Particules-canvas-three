import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { Suspense } from "react";
import ParticulesShapeOne from "../particules/ParticulesShapeOne";
// import { div } from "three/examples/jsm/nodes/Nodes.js";

const ParticulesShapeOneScene = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={1.9}>
        <Suspense fallback={null}>
          <ParticulesShapeOne />
        </Suspense>
        <Preload />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ParticulesShapeOneScene;
