export const getTorusWeird = (
  numPoints: number,
  q: number,
  p: number,
  r: number
) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const pos = Math.random() * Math.PI * 2;
    // s = segment / t = tubes
    const s = i * Math.PI * 2 + pos;
    const t = i * Math.PI * 2 * pos;
    const cx = Math.cos(t);
    const cy = Math.sin(t);
    const v = (q / p) * s * pos;

    const x = r * Math.cos(s) * (2 + Math.cos(v)) + cx;
    const y = r * Math.sin(s) * (2 + Math.cos(v)) + cy;
    const z = r * Math.sin(v);

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

export const getTorusKnotFlat = (
  numPoints: number,
  q: number,
  p: number,
  r: number
) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const pos = Math.random() * Math.PI * 2;
    // s = segment / t = tubes
    const s = i * Math.PI * 2 + pos;
    const t = i * Math.PI * 2 * pos;
    const cx = Math.cos(t);
    const cy = Math.sin(t);
    const v = (q / p) * s;

    const x = r * Math.cos(s) * (2 + Math.cos(v)) + cx;
    const y = r * Math.sin(s) * (2 + Math.cos(v)) + cy;
    const z = r * Math.sin(v);

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};
