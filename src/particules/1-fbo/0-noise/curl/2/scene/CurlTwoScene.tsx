import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";

const CurlTwoScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [-1, 2, 3.5] }} dpr={1}>
        <CurlTwoFBO />
      </Canvas>
    </Suspense>
  );
};

export default CurlTwoScene;
