import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import TorusKnotFBO from "../particules/TorusKnotFBO";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";

const TorusKnotScene = () => {
  return (
    <div className="h-screnn w-screen">
      <DummyLoader />
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 5] }} dpr={1.25}>
          <TorusKnotFBO />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default TorusKnotScene;
