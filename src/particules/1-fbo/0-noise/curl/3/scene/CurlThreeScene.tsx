import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlThreeFBO";
import Loading from "../../../../../../layout/loader/Loader";

const CurlThreeScene = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [-1, 2, 3.5] }}>
        <CurlTwoFBO />
      </Canvas>
    </Suspense>
  );
};

export default CurlThreeScene;
