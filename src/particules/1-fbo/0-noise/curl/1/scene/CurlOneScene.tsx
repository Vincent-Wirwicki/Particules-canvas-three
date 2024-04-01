import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlOneFBO from "../particules/CurlOneFBO";
import Loading from "../../../../../../layout/loader/Loader";
import { AdaptiveDpr } from "@react-three/drei";
import DummyLoader from "../../../../../../layout/dummyLoader/DummyLoader";

const CurlOneScene = () => {
  return (
    <div className="h-screen w-screen">
      {/* <div className="fixed top-1/2 left-1/2 text-2xl font-bold  text-neutral-500">
        out of <br />
        control <br />
        curl noise <br />
        can get <br />
      </div> */}
      <DummyLoader />
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [0.5, 2.5, 25] }} dpr={2}>
          <CurlOneFBO />
          <AdaptiveDpr pixelated />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CurlOneScene;
