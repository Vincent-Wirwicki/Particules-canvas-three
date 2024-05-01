import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";
const AttractorFBOThree = lazy(() => import("../particules/AttractorFBOThree"));

const AttractorThreeScene = () => {
  return (
    <Suspense fallback={<DummyLoader />}>
      <Canvas camera={{ position: [13, 13, 15] }}>
        <AttractorFBOThree />
      </Canvas>
    </Suspense>
  );
};

export default AttractorThreeScene;
