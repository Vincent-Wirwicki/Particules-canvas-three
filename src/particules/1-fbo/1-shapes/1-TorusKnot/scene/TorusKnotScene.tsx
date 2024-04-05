import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import TorusKnotFBO from "../particules/TorusKnotFBO";
import { Preload } from "@react-three/drei";

const TorusKnotScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 15] }} dpr={[1, 2]}>
        <TorusKnotFBO />
        <Preload />
      </Canvas>
    </Suspense>
  );
};

export default TorusKnotScene;
