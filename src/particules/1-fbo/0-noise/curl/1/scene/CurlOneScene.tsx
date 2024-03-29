import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlOneFBO from "../particules/CurlOneFBO";
import Loading from "../../../../../../layout/loader/Loader";
import { AdaptiveDpr } from "@react-three/drei";

const CurlOneScene = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [0.5, 2.5, 25] }} dpr={2}>
        <CurlOneFBO />
        <AdaptiveDpr pixelated />
      </Canvas>
    </Suspense>
  );
};

export default CurlOneScene;
