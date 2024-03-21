import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import TerrainParticules from "../particules/TerrainParticules";

const TerrainParticulesScene = () => {
  return (
    <Canvas camera={{ position: [0, -1.75, -0.35] }}>
      <Suspense fallback={null}>
        <TerrainParticules />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default TerrainParticulesScene;
// camera={{ position: [0, -0.5, 0.1] }} 0.33184823306263417 2.7312241891882465 -0.16992885532869062
// 0, -2.73, -0.76
