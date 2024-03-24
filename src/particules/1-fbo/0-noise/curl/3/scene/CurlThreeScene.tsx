import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlThreeFBO from "../particules/CurlThreeFBO";
import Loading from "../../../../../../layout/loader/Loader";
import { Loader, Preload } from "@react-three/drei";

const CurlThreeScene = () => {
  return (
    <div className="h-[550px] w-[550px]">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [-1, 2, 3] }} dpr={1.9}>
          <CurlThreeFBO />
          <Preload />
        </Canvas>
      </Suspense>
      <Loader />
    </div>
  );
};

export default CurlThreeScene;
