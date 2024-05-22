import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import LabTwoRenderFBO from "../particules/LabTwoRenderFBO";
// import { div } from "three/examples/jsm/nodes/Nodes.js"; position: [2, 1, 10]

// -2.9, 9.67, 62 chee attractor -32.66, 10.67, 23.66
// -41.66, 28.67, 12.66 sakyra
// -35.66, 5.67, 1
const LabTwoRenderScene = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [-6.02, -6.03, -6.03] }} dpr={2}>
        <Suspense fallback={null}>
          <LabTwoRenderFBO />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default LabTwoRenderScene;
