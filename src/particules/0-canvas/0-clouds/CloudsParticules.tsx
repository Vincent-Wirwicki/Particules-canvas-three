import { useRef } from "react";

import useParticules from "./useParticules";

const CloudsParticules = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const config = { color: "#b91c1c", radius: 1, density: 300, maxDist: 80 };
  
  useParticules(canvasRef, config);

  return <canvas className="canvas-fit" ref={canvasRef} />;
};

export default CloudsParticules;
