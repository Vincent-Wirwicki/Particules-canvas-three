// import { useState, useEffect, useCallback } from "react";
// // import { getImageData } from "../../utils/getImageDataFBO";

// type ImgData = {
//   data: Float32Array | null;
//   width: number;
//   height: number;
// };

// const useLoadImage = (url: string) => {
//   const [imgData, setImgData] = useState<ImgData | null>();

//   const onLoad = useCallback(() => {
//     // const data = getImageData(url, 64);
//     setImgData(data);
//   }, [url]);

//   useEffect(() => {
//     const image = new Image();
//     image.crossOrigin = "Anonymous";
//     image.src = url;
//     image.addEventListener("load", onLoad);

//     return () => {
//       image.removeEventListener("load", onLoad);
//     };
//   }, [url, onLoad]);

//   return { imgData };
// };

// export default useLoadImage;
