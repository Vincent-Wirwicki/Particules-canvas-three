import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense } from "react";

// import { OrbitControls } from "@react-three/drei";
import ParticulesFBOone from "../particules/ParticulesFBOCurl";

const ParticulesFBOSceneCurl = () => {
  return (
    <Canvas camera={{ position: [-52, 4, -2] }}>
      <Suspense fallback={null}>
        <ParticulesFBOone />
      </Suspense>
      <Preload />
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default ParticulesFBOSceneCurl;
