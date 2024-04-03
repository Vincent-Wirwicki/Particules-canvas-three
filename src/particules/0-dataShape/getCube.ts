export const getCube = (numPoints: number, radius: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    // const d = Math.random() * 2 + 1;
    // const d1 = Math.sqrt(Math.random()) * 2.0;

    const x = Math.random() * radius;
    const y = Math.random() * radius;
    const z = Math.random() * radius;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }
  return data;
};
