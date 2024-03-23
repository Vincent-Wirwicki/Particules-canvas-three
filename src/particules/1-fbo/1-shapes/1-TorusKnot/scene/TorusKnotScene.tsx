import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/TorusKnotFBO";

const TorusKnotScene = () => {
  return (
    <div className="h-screnn w-4/6">
      <Suspense
        fallback={
          <div className="fixed top-0 left-0 z-50 w-screen h-screen text-neutral-100 bg-black">
            Loading...
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 15] }}>
          <CurlTwoFBO />
          <Preload />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default TorusKnotScene;
