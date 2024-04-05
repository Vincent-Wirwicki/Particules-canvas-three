import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BustFBO from "../particules/BustFBO";
import Loading from "../../../../../layout/loader/Loader";

const BustScene = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [0, 0, 0] }}>
        <BustFBO />
      </Canvas>
    </Suspense>
  );
};

export default BustScene;
