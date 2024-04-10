import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";
const AttractorFBOTwo = lazy(() => import("../particules/AttractorFBOTwo"));

const AttractorTwoScene = () => {
  return (
    <Suspense fallback={<DummyLoader />}>
      <Canvas camera={{ position: [-1, 2, 9] }}>
        <AttractorFBOTwo />
      </Canvas>
    </Suspense>
  );
};

export default AttractorTwoScene;
