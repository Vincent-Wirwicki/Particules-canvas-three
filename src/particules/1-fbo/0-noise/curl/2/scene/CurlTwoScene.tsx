import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";
import Loading from "../../../../../../layout/loader/Loader";

const CurlTwoScene = () => {
  return (
    <div className="h-[512px] w-[512px]">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [-1, 2, 3.5] }} dpr={2}>
          <CurlTwoFBO />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CurlTwoScene;
