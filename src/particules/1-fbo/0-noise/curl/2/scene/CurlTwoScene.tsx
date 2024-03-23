import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";
import Loading from "../../../../../../layout/loader/Loader";

const CurlTwoScene = () => {
  return (
    <div className="h-5/6 w-1/2">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [-1, 2, 3.5] }}>
          <CurlTwoFBO />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CurlTwoScene;
