import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import AttractorFBOOne from "../particules/AttractorFBOTwo";
import { OrbitControls } from "@react-three/drei";

// const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));
// import { div } from "three/examples/jsm/nodes/Nodes.js";OrbitControls lazy autoRotate

const AttractorTwoScene = () => {
  return (
    <div className="w-screen h-screen">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 10] }} dpr={1.5}>
          <AttractorFBOOne />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AttractorTwoScene;
