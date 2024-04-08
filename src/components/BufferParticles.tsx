import { FC } from "react";

interface Props {
  particles: Float32Array;
}

const BufferParticles: FC<Props> = ({ particles }) => {
  return (
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        count={particles.length / 3}
        array={particles}
        itemSize={3}
      />
    </bufferGeometry>
  );
};

export default BufferParticles;
