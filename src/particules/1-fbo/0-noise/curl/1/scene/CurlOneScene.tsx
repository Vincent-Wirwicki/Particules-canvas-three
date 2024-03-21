import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { Suspense } from "react";
import CurlOneFBO from "../particules/CurlOneFBO";

const CurlOneScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0.5, 2.5, 25] }}>
        <CurlOneFBO />
        <Preload />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default CurlOneScene;
