import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
const TorusKnotFBO = lazy(() => import("../particules/TorusKnotFBO"));

const TorusKnotScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 15] }} dpr={[1, 2]}>
        <TorusKnotFBO />
      </Canvas>
    </Suspense>
  );
};

export default TorusKnotScene;
