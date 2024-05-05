import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import LabTwoRenderFBO from "../particules/LabTwoRenderFBO";
// import { div } from "three/examples/jsm/nodes/Nodes.js"; position: [2, 1, 10]

const LabTwoRenderScene = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [13, 13, 15] }} dpr={2}>
        <Suspense fallback={null}>
          <LabTwoRenderFBO />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default LabTwoRenderScene;
