import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import HeavyOneFBO from "../particules/HeavyOneFBO";

const HeavyOneScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 2, 3.5] }}>
        <HeavyOneFBO />
      </Canvas>
    </Suspense>
  );
};

export default HeavyOneScene;
