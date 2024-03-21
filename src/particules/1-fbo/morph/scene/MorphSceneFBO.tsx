import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import MorphParticulesFBO from "../particules/MorphParticulesFBO";
const MorphSceneFBO = () => {
  return (
    <Canvas>
      {/* <MorphParticulesFBO /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default MorphSceneFBO;
