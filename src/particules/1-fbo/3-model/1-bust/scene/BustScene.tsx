import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BustFBO from "../particules/BustFBO";
// import Loading from "../../../../../layout/loader/Loader";
import { Loader } from "@react-three/drei";

const BustScene = () => {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 0] }} dpr={1.5}>
        <BustFBO />
      </Canvas>
      <Loader />
    </Suspense>
  );
};

export default BustScene;
