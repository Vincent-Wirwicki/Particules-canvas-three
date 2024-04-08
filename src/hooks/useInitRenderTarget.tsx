import { useFBO } from "@react-three/drei";
import { FloatType, NearestFilter, RGBAFormat } from "three";

const useInitRenderTarget = (size: number) => {
  const target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
  });
  return target;
};

export default useInitRenderTarget;
