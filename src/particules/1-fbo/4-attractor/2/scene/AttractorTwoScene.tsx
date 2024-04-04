import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import AttractorFBOTwo from "../particules/AttractorFBOTwo";
import { OrbitControls, Preload } from "@react-three/drei";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";

// const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));
// import { div } from "three/examples/jsm/nodes/Nodes.js";OrbitControls lazy autoRotate

const AttractorTwoScene = () => {
  return (
    <div className="w-screen h-screen">
      <Suspense fallback={null}>
        <DummyLoader />
        <Canvas camera={{ position: [-1, 2, 10] }} dpr={1.75}>
          <AttractorFBOTwo />
          <OrbitControls autoRotate />
          <Preload />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AttractorTwoScene;
