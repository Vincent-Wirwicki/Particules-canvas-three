import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/BustFBO";

const BustScene = () => {
  return (
    <Suspense
      fallback={
        <div className="fixed top-0 left-0 z-50 w-screen h-screen text-neutral-100 bg-black">
          Loading...
        </div>
      }
    >
      <Canvas
        camera={{
          position: [0, 0, 0],
        }}
      >
        <CurlTwoFBO />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default BustScene;
