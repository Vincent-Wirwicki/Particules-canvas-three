import { createPortal } from "@react-three/fiber";
import { ReactNode } from "react";
import { Scene } from "three";

interface Props {
  positions: Float32Array;
  uvs: Float32Array;
  scene: Scene;
  children: ReactNode;
}

const PortalMesh: React.FC<Props> = ({ children, scene, positions, uvs }) => {
  return createPortal(
    <mesh>
      {children}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={uvs.length / 2}
          array={uvs}
          itemSize={2}
        />
      </bufferGeometry>
    </mesh>,
    scene
  );
};

export default PortalMesh;
