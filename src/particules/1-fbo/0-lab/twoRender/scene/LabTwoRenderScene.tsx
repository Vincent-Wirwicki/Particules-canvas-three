import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import LabTwoRenderFBO from "../particules/LabTwoRenderFBO";
// import { div } from "three/examples/jsm/nodes/Nodes.js";

const LabTwoRenderScene = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 5, 10] }} dpr={1.75}>
        <Suspense fallback={null}>
          <LabTwoRenderFBO />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default LabTwoRenderScene;
