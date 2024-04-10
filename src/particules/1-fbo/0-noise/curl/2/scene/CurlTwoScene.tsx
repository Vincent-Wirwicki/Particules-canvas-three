import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
const CurlTwoFBO = lazy(() => import("../particules/CurlTwoFBO"));

const CurlTwoScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <CurlTwoFBO />
      </Canvas>
    </Suspense>
  );
};

export default CurlTwoScene;
