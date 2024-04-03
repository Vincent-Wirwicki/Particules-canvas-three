import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";

const CurlTwoScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    <div className="h-[720px] w-[720px]">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [-1, 2, 3.5] }} dpr={1.75}>
          <CurlTwoFBO />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CurlTwoScene;
