import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, ShaderMaterial } from "three";

import { useRef, useMemo } from "react";

import { TerrainParticulesFragment } from "../shader/TerrainParticulesFragment";
import { TerrainParticulesVertex } from "../shader/TerrainParticulesVertex";

const TerrainParticules = () => {
  const ref = useRef<ShaderMaterial | null>(null);
  // const refPoints1 = useRef<Points | null>(null);
  // const refPoints2 = useRef<Points | null>(null);

  const dataShader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
      },
      vertex: TerrainParticulesVertex,
      fragment: TerrainParticulesFragment,
    }),
    []
  );

  const size = 128;
  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const x = ((i % size) - 50) * 0.05;
      const y = (Math.floor(i / size) - 50) * 0.05;
      const z = 0;
      particles.set([x, y, z], i * 3);
    }

    return particles;
  }, [size]);

  useFrame(({ clock: { elapsedTime } }) => {
    // console.log(camera.position);camera
    if (ref.current) ref.current.uniforms.uTime.value = elapsedTime * 0.5;
  });

  return (
    <>
      <points position={[0, -0.5, 0.5]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={ref}
          attach="material"
          uniforms={dataShader.uniforms}
          vertexShader={dataShader.vertex}
          fragmentShader={dataShader.fragment}
          depthTest={false}
          depthWrite={false}
          transparent={true}
          blending={AdditiveBlending}
        />
      </points>
    </>
  );
};

export default TerrainParticules;

// other way to generate a plane
// for (let i = 0; i < size; i++) {
//   for (let j = 0; j < size; j++) {
//     const x = (j / size - 0.5) * 5;
//     const y = (i / size - 0.5) * 5;
//     const z = 0;

//     const index = i * size + j;
//     particles.set([x, y, z], index * 3);
//   }
// }
// if (refPoints1.current)
//   refPoints1.current.position.y = (elapsedTime * 0.5) % 10;
// if (refPoints2.current)
//   refPoints2.current.position.y = ((elapsedTime * 0.5) % 2) - 2;
/* <shaderMaterial
        ref={ref}
        attach="material"
        uniforms={dataShader.uniforms}
        vertexShader={dataShader.vertex}
        fragmentShader={dataShader.fragment}
      />     <points>
      <sphereGeometry args={[1, 48, 48]} />
      <pointsMaterial color="#5786F5" size={0.005} sizeAttenuation />
    </points>*/
