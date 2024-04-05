import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import AttractorFBOOne from "../particules/AttractorFBOOne";
// import { OrbitControls } from "@react-three/drei";
import DummyLoader from "../../../../../layout/dummyLoader/DummyLoader";

// const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));
// import { div } from "three/examples/jsm/nodes/Nodes.js";OrbitControls lazy

const AttractorOneScene = () => {
  return (
    <div className="w-screen h-screen">
      <DummyLoader />
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 5, 15] }}>
          <AttractorFBOOne />
          {/* <OrbitControls autoRotate autoRotateSpeed={0.75} /> */}
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AttractorOneScene;
