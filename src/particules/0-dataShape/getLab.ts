// experimenting with x,y,z
// other 3D data shapes in comments below

export const getThomas = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const { sin } = Math;
    const b = 0.19;

    const x = Math.random() * Math.PI * 2 - 1;
    const y = Math.random() * Math.PI * 2 - 1;
    const z = Math.random() * Math.PI * 2 - 1;

    data[stride] = -b * x + sin(y);
    data[stride + 1] = -b * y + sin(z);
    data[stride + 2] = -b * z + sin(x);
    data[stride + 3] = 1;
  }

  return data;
};

export const getLab = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const { cosh, cos, sin } = Math;
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * 2 - 1;
    const c = 4;

    const x = c * cosh(v / c) * cos(u);
    const y = c * cosh(v / c) * sin(u);
    const z = v;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

export const getLab2 = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * 2 - 1;
    // t = torsion;
    const t = Math.PI;
    // const bot = 1 + Math.cosh(u) * Math.cosh(v);

    // const x = v * Math.cos(t * u);
    // const y = v * Math.sin(t * u);
    // const z = u;

    const x = v * Math.cos(t * u);
    const y = v * Math.sin(t * u);
    const z = u;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

export const getRandomLab = (numPoints: number) => {
  const size = numPoints * numPoints * 4;
  const data = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * 2 - 1;
    // t = torsion;
    // const t = 1;
    // const bot = 1 + Math.cosh(u) * Math.cosh(v);

    const x = v * u;
    const y = Math.PI * 4 * (Math.random() - 0.5);
    const z = v;

    data[stride] = x;
    data[stride + 1] = y;
    data[stride + 2] = z;
    data[stride + 3] = 1;
  }

  return data;
};

// Catenoid ---------------------------------------
// const u = Math.random() * Math.PI * 2;
// const v = Math.random() * 2 - 1;
// const c = 1;

// const x = c * Math.cosh(v / c) * Math.cos(u);
// const y = c * Math.cosh(v / c) * Math.sin(u);
// const z = v;
// --------------------------------------------------

//catenoid to helicoid ------------------------------
// x = Math.cos(s) * Math.sinh(v)*Math.sin(u) + Math.sin(s) * Math.cosh(v)*Math.cos(u)
// y = -Math.cos(s) * Math.sinh(v)*Math.sin(u) + Math.sin(s) * Math.cosh(v)*Math.cos(u)
// z = u * Math.cos(s) + v*sin(s)
// -------------------------------------------------

// Hyperbolic Helicoid -----------------------------
// const u = Math.random() * Math.PI * 2;
// const v = Math.random() * 2 - 1;
// t = torsion
// const t = 2;
// const bot = 1 + Math.cosh(u) * Math.cosh(v);

// const x = (Math.sinh(v) * Math.cos(t * u)) / bot;
// const y = (Math.sinh(v) * Math.sin(t * u)) / bot;
// const z = (Math.cosh(v) * Math.sinh(u)) / bot;
// --------------------------------------------------

// some sort of Möbius strip -----------------------
// const v = Math.random() * Math.PI * 2;
// const t = Math.random() * 2 - 1;

// const x = 1 + (t / 2) * Math.cos(v / 2) * Math.cos(v);
// const y = 1 + (t / 2) * Math.cos(v / 2) * Math.sin(v);
// const z = (t / 2) * Math.sin(v / 2);

// const t = 1
// const x = 2 + 1 * Math.cos(u * 0.5) * Math.cos(u);
// const y = 2 + 1 * Math.cos(u * 0.5) * Math.sin(u);
// const z = v * Math.sin(u * 0.5);
// --------------------------------------------------

// some sort of torus -------------------------------
//  const u = Math.random() * Math.PI * 2;
//  const v = Math.random() * Math.PI * 2;
//  const R = 2;
//  const r = 0.5;

//  const x = (R + r * Math.cos(v)) * Math.cos(u);
//  const y = (R + r * Math.cos(v)) * Math.sin(u);
//  const z = R * Math.sin(v);
// --------------------------------------------------
