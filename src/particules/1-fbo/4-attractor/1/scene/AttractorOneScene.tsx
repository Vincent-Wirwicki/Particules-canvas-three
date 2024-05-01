import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";
import { OrbitControls } from "@react-three/drei";
const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));

const AttractorOneScene = () => {
  return (
    <Suspense fallback={<DummyLoader />}>
      <Canvas camera={{ position: [0, 5, 15] }} dpr={2}>
        <AttractorFBOOne />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default AttractorOneScene;
