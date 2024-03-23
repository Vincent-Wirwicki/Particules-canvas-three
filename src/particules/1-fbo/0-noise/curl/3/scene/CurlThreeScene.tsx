import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlThreeFBO from "../particules/CurlThreeFBO";
import Loading from "../../../../../../layout/loader/Loader";
import { Loader, Preload } from "@react-three/drei";

const CurlThreeScene = () => {
  return (
    <div className="h-5/6 w-1/2">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [-1, 2, 3.5] }}>
          <CurlThreeFBO />
          <Preload />
        </Canvas>
      </Suspense>
      <Loader />
    </div>
  );
};

export default CurlThreeScene;
