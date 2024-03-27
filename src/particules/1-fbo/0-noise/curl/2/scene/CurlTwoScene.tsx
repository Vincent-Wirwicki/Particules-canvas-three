import { Canvas } from "@react-three/fiber";
import { Suspense, } from "react";
import CurlTwoFBO from "../particules/CurlTwoFBO";
import Loading from "../../../../../../layout/loader/Loader";

const CurlTwoScene = () => {
  // const [dpr, setDpr] = useState(0.5);

  return (
    <div className="h-[720px] w-[720px]">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [-1, 2, 3.5] }} dpr={1.95}>
          <CurlTwoFBO />
          {/* <AdaptiveDpr pixelated /> */}
          {/* <PerformanceMonitor
            factor={1}
            // onChange={({ factor }) => setDpr(Math.floor(0.5 + 1.5 * factor))}
            onIncline={() => setDpr(1.75)}
            onDecline={() => setDpr(0.25)}
          /> */}
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CurlTwoScene;
