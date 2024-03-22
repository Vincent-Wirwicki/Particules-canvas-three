import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlThreeFBO";

const CurlThreeScene = () => {
  return (
    <Suspense
      fallback={
        <div className="fixed top-0 left-0 z-50 w-screen h-screen text-neutral-100 bg-black">
          Loading...
        </div>
      }
    >
      <Canvas camera={{ position: [-1, 2, 3.5] }}>
        <Suspense
          fallback={
            <div className="fixed top-0 left-0 z-50 w-screen h-screen text-neutral-100 bg-black">
              Loading...
            </div>
          }
        >
          <CurlTwoFBO />
        </Suspense>
        <Preload />
      </Canvas>
    </Suspense>
  );
};

export default CurlThreeScene;
