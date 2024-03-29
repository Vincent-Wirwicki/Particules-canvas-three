import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/TorusKnotFBO";

const TorusKnotScene = () => {
  return (
    <div className="h-screnn w-4/6">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 15] }} dpr={1.5}>
          <CurlTwoFBO />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default TorusKnotScene;
