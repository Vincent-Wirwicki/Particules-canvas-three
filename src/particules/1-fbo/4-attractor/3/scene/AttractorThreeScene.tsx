import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import AttractorFBOOne from "../particules/AttractorFBOThree";

// const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));
// import { div } from "three/examples/jsm/nodes/Nodes.js";OrbitControls lazy autoRotate

const AttractorThreeScene = () => {
  return (
    <div className="w-screen h-screen">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 5] }} dpr={1.5}>
          <AttractorFBOOne />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AttractorThreeScene;
