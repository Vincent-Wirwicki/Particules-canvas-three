import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import LabOneRenderFBO from "../particules/LabOneRenderFBO";
import { OrbitControls } from "@react-three/drei";

const LabOneRenderScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 2] }} dpr={1.5}>
        <LabOneRenderFBO />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default LabOneRenderScene;
