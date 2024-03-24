import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/BustFBO";
import Loading from "../../../../../layout/loader/Loader";

const BustScene = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [0, 0, 0] }} dpr={1.5}>
        <CurlTwoFBO />
      </Canvas>
    </Suspense>
  );
};

export default BustScene;
