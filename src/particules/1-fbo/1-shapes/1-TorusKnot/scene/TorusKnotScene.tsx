import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import TorusKnotFBO from "../particules/TorusKnotFBO";

const TorusKnotScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 15] }} dpr={1.25}>
        <TorusKnotFBO />
      </Canvas>
    </Suspense>
  );
};

export default TorusKnotScene;
