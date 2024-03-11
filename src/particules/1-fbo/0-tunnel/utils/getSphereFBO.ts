import { Vector3 } from "three";

export const getPoint = (
  vec: Vector3,
  size: number,
  data: Float32Array,
  offset: number
): Vector3 => {
  vec.x = Math.random() * 2 - 1;
  vec.y = Math.random() * 2 - 1;
  vec.z = Math.random() * 2 - 1;
  if (vec.length() > 1) return getPoint(vec, size, data, offset);
  return vec.normalize().multiplyScalar(size);
};

export const getSphere = (count: number, size: number): Float32Array => {
  const data = new Float32Array(count * 4);
  const vec = new Vector3();
  for (let i = 0; i < count * 4; i += 4) {
    getPoint(vec, size, data, i);
    data[i] = vec.x;
    data[i + 1] = vec.y;
    data[i + 2] = vec.z;
    // data[i + 3] = 1;
  }
  return data;
};
