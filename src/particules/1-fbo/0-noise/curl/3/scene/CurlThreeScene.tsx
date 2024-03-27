import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlThreeFBO from "../particules/CurlThreeFBO";
import Loading from "../../../../../../layout/loader/Loader";
import { Preload } from "@react-three/drei";
// h-[720px] w-[720px]
const CurlThreeScene = () => {
  return (
    <div className="h-[512px] w-[512px]">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [-1, 2, 3] }} dpr={2}>
          <Suspense fallback={<Loading />}>
            <CurlThreeFBO />
          </Suspense>

          <Preload />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CurlThreeScene;
