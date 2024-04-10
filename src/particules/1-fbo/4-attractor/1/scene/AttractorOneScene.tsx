import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";
const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));

const AttractorOneScene = () => {
  return (
    <Suspense fallback={<DummyLoader />}>
      <Canvas camera={{ position: [0, 5, 15] }}>
        <AttractorFBOOne />
      </Canvas>
    </Suspense>
  );
};

export default AttractorOneScene;
