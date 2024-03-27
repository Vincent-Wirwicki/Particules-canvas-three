import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import AttractorFBOOne from "../particules/AttractorFBOOne";
import { OrbitControls } from "@react-three/drei";

// const AttractorFBOOne = lazy(() => import("../particules/AttractorFBOOne"));
// import { div } from "three/examples/jsm/nodes/Nodes.js";OrbitControls lazy

const AttractorOneScene = () => {
  return (
    <div className="w-screen h-screen">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 5, 10] }} dpr={1.75}>
          <AttractorFBOOne />
          <OrbitControls autoRotate />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AttractorOneScene;
