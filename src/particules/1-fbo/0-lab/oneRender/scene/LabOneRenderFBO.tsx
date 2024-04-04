import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import LabOneRenderFBO from "../particules/LabOneRenderFBO";
import { OrbitControls } from "@react-three/drei";

const LabOneRenderScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [-1, 2, 3.5] }} dpr={1.75}>
        <LabOneRenderFBO />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default LabOneRenderScene;
