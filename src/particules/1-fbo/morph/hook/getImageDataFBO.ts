// const getCanvas = (w: number, h: number) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = w || 512;
//   canvas.height = h || 512;
//   return canvas;
// };

// // const getContext = () => {};

// const getImage = (url: string) => {
//   // const img = new ImageLoader().setCrossOrigin("anonymous").load(url);
//   const img = new Image();
//   img.crossOrigin = "Anonymous";
//   img.src = url;
//   return img;
// };


// type ImgData = {
//   data: Float32Array | null;
//   width: number;
//   height: number;
// };

// export const getImageData = (url: string, elevation: number): ImgData | null => {
//   const image = getImage(url);
//   const { width, height } = image;
//   const canvas = getCanvas(width, height);
//   const ctx = canvas.getContext("2d");

//   if (!ctx) return null;

//   ctx.drawImage(image, 0, 0);
//   const imgData = ctx.getImageData(0, 0, width, height);
//   const iData = imgData.data;
//   const len = width * height;
//   const data = new Float32Array(len * 4);

//   for (let i = 0; i < len; i += 4) {
//     const i3 = i * 3;
//     const i4 = i * 4;
//     data[i3] = (i % width) - width * 0.5;
//     data[i3 + 1] =
//       ((iData[i4] / 0xff) * 0.299 +
//         (iData[i4 + 1] / 0xff) * 0.587 +
//         (iData[i4 + 2] / 0xff) * 0.114) *
//       elevation;
//     data[i3 + 2] = i / width - height * 0.5;
//     data[i3 + 3] = 1;
//   }
//   return { data, width, height };
// };
