import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";

const CurlTwoScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    // <div className="h-[512px] w-[512px]">
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <CurlTwoFBO />
      </Canvas>
    </Suspense>
    // </div>
  );
};

export default CurlTwoScene;
