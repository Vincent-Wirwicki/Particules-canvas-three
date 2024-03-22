import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";
import Loading from "../../../../../../layout/loader/Loader";

const CurlTwoScene = () => {
  return (
    <main className="canvas-wrap">
      <div className="canvas-box">
        <Suspense fallback={<Loading />}>
          <Canvas camera={{ position: [-1, 2, 3.5] }}>
            <CurlTwoFBO />
          </Canvas>
        </Suspense>
      </div>
    </main>
  );
};

export default CurlTwoScene;
