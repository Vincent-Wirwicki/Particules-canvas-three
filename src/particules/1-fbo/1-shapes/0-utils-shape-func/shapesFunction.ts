// import { MathUtils } from "three";

export const getPlane = (numPoints: number, radius: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    const x = Math.random() * radius;
    const y = Math.random() * radius;
    const z = 0;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }
  return data;
};

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

export const getSphere = (numPoints: number, r: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    const u = Math.random();
    const v = Math.random();

    // theta varies from 0 to 2π, and phi varies from 0 to π.
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }
  return data;
};

export const getTorus = (
  numPoints: number
  // majorRadius: number,
  // minorRadius: number
) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size); // Each point has 3 coordinates

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    // const a = numPoints * numPoints;(i / numPoints)
    const p = 5;
    const q = 8;
    //if q > p full torus
    const u = (i / size) * p * Math.PI * 2;

    const pointIdx = Math.random() * Math.PI * 2;
    const v = (q / p) * u;

    const x = 2 * Math.cos(pointIdx) * (2 + Math.cos(v));
    const y = 2 * Math.sin(pointIdx) * (2 + Math.cos(v));
    const z = Math.sin(v);

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

export const getTorusKnot = (
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

    const u = i * Math.PI * 2 + pos;
    const u1 = i * Math.PI * 2 * pos;
    const cx = Math.cos(u1);
    const cy = Math.sin(u1);
    const v = (q / p) * u;

    const x = r * Math.cos(u) * (2 + Math.cos(v)) + cx;
    const y = r * Math.sin(u) * (2 + Math.cos(v)) + cy;
    const z = r * Math.sin(v);

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

export const getTorusKnotWireFrame = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size); // Each point has 3 coordinates
  const p = 2;
  const q = 3;
  const segment = 64;
  const tubes = 16;

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    // const a = numPoints * numPoints;(i / numPoints)

    //if q > p full torus
    const pos = Math.random() * Math.PI * 2;

    const u = (i / segment) * Math.PI * 2 + pos;
    const u1 = (i / tubes) * Math.PI * 2;
    const cx = Math.cos(u1);
    const cy = Math.sin(u1);
    // const u1 = (i/ 64) * Math.PI * 2
    const v = (q / p) * u;

    // const pointIdx = Math.random() * Math.PI * 2;

    const x = Math.cos(u) * (2 + Math.cos(v)) + cx;
    const y = Math.sin(u) * (2 + Math.cos(v)) + cy;
    const z = Math.sin(v);

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

export const getFlatTorusKnot = (
  numPoints: number,
  p: number,
  q: number,
  radius: number,
  tubularSegments: number
) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < tubularSegments; j++) {
      const index = i * tubularSegments + j;
      const stride = index * 4;
      const pos = Math.random() * Math.PI * 2;
      const u = (i / numPoints) * Math.PI * 2 * pos;
      const v = (p / q) * u;
      const phi = (j / tubularSegments) * Math.PI * 2;

      const x = Math.cos(u) * (radius + Math.cos(v) * Math.cos(phi));
      const y = Math.sin(u) * (radius + Math.cos(v) * Math.cos(phi));
      const z = Math.sin(v) * Math.cos(phi);

      data[stride] = x;
      data[stride + 1] = y;
      data[stride + 2] = z;
      data[stride + 3] = 1;
    }
  }

  return data;
};

// export const getDataWeirdRayFromCenter = (
//   numPoints: number
//   // majorRadius: number,
//   // minorRadius: number
// ) => {
//   const size = numPoints * numPoints * 4;
//   const data = new Float32Array(size); // Each point has 3 coordinates

//   for (let i = 0; i < size; i++) {
//     const stride = i * 4;
//     // const a = numPoints * numPoints;(i / numPoints)
//     const p = 10;
//     const q = 5;
//     //if q > p full torus

//     const u = (i / 64) * Math.PI * 2 * p;
//     const u1 = (i / 32) * Math.PI * 2;
//     const cx = Math.cos(u1);
//     const cy = Math.sin(u1);
//     const cxy = cx + cy;
//     // const u1 = (i/ 64) * Math.PI * 2
//     const v = (q / p) * u;

//     const pos = Math.random() * Math.PI * 2;
//     // const pointIdx = Math.random() * Math.PI * 2;

//     const x = Math.cos(u) * (2 + Math.cos(v)) + cxy;
//     const y = Math.sin(u) * (2 + Math.cos(v)) + cxy;
//     const z = Math.sin(v) + cxy;

//     data[stride] = x * pos;
//     data[stride + 1] = y * pos;
//     data[stride + 2] = z * pos;
//     data[stride + 3] = 1;
//   }

//   return data;
// };

// function getPoint(
//   v: Vector3,
//   size: number,
//   data: Float32Array,
//   offset: number
// ) {
//   v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
//   if (v.length() > 1) return getPoint(v, size, data, offset);
//   return v.normalize().multiplyScalar(size).toArray(data, offset);
// }

// function getSphere(count: number, size: number, p = new Vector4()) {
//   const data = new Float32Array(count * 4);
//   for (let i = 0; i < count * 4; i += 4) getPoint(p, size, data, i);
//   return data;
// }

// const data = getSphere(size * size, 128, new Vector4());
