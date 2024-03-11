import { useRef, useState } from "react";
import useTheWallParticules from "./useTheWallParticules";

const TheWallParticules = () => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useTheWallParticules(canvasRef, isHover);

  return (
    <div
      className="w-5/6 h-4/6"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <canvas className="canvas-fit" ref={canvasRef} />
    </div>
  );
};

export default TheWallParticules;
