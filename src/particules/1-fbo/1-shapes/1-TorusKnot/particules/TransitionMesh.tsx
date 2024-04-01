import { useAspect } from "@react-three/drei";

const TransitionMesh = () => {
  const s = useAspect(window.innerWidth, window.innerHeight, 1);

  return (
    <mesh scale={s} position={[0, 0, 10]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
};

export default TransitionMesh;
