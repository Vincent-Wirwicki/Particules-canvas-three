import { useCallback, useEffect, useRef, RefObject } from "react";

interface Coordinate {
  x: number;
  y: number;
}

interface Particule {
  origin: Coordinate;
  pos: Coordinate;
  velocity: Coordinate;
  size: number;
}

const useTheWallParticules = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  isHover: boolean
) => {
  const rafRef = useRef(0);
  const mouseRef = useRef({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    radius: { display: 10, collision: 50 },
  });
  const mouse = mouseRef.current;
  const particulesRef = useRef<Particule[]>([]);
  const friction = 0.95;
  const ease = 0.075;
  const gap = 10;

  const initParticules = useCallback(() => {
    if (canvasRef.current) {
      for (let x = 0; x < canvasRef.current.width; x += gap) {
        for (let y = 0; y < canvasRef.current.height; y += gap) {
          particulesRef.current.push({
            origin: { x: x, y: y },
            pos: { x: Math.floor(x), y: Math.floor(y) },
            velocity: { x: 0, y: 0 },
            size: Math.floor(Math.random() * 4),
          });
        }
      }
    }
  }, [canvasRef]);

  const drawParticule = useCallback(
    (ctx: CanvasRenderingContext2D, { pos: { x, y }, size }: Particule) => {
      ctx.beginPath();
      ctx.fillRect(x, y, size, size);
    },
    []
  );

  const update = useCallback(
    ({ origin, pos, velocity, size }: Particule) => {
      if (canvasRef.current) {
        const dx = mouse.target.x - pos.x;
        const dy = mouse.target.y - pos.y;
        const dist = Math.hypot(dy, dx);
        const force = -(mouse.radius.collision / dist) * 0.5;

        if (dist < mouse.radius.collision) {
          const angle = Math.atan2(dy, dx);
          velocity.x += force * Math.cos(angle);
          velocity.y += force * Math.sin(angle);
        }

        pos.x += (velocity.x *= friction) + (origin.x - pos.x) * ease;
        pos.y += (velocity.y *= friction) + (origin.y - pos.y) * ease;

        if (pos.x < size || pos.x > canvasRef.current.width - size)
          velocity.x *= -1;
        if (pos.y < size || pos.y > canvasRef.current.height - size)
          velocity.y *= -1;
      }
    },
    [mouse, canvasRef]
  );

  const updateCursor = useCallback(
    (el: HTMLElement) => {
      const { current, target } = mouse;
      if (isHover) {
        const dx = current.x - target.x;
        const dy = current.y - target.y;
        target.x += dx * ease;
        target.y += dy * ease;
      } else {
        const { height, width } = el.getBoundingClientRect();
        const toCenterX = width / 2 - target.x;
        const toCenterY = height / 2 - target.y;
        target.x += toCenterX * 0.04;
        target.y += toCenterY * 0.04;
      }
    },
    [mouse, isHover]
  );

  const drawCursor = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.arc(
        mouse.target.x,
        mouse.target.y,
        mouse.radius.display,
        0,
        Math.PI * 2
      );
      ctx.fill();
    },
    [mouse]
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    const onMove = ({ clientX, clientY }: MouseEvent) => {
      if (canvas) {
        const parentEl = canvas.parentElement;
        if (parentEl) {
          const { top, left } = parentEl.getBoundingClientRect();
          mouse.current.x = clientX - left;
          mouse.current.y = clientY - top;
        }
      }
    };

    const onResize = () => {
      if (canvas) {
        const parentEl = canvas.parentElement;

        if (parentEl) {
          canvas.height = parentEl.offsetHeight;
          canvas.width = parentEl.offsetWidth;
          if (particulesRef.current.length) particulesRef.current = [];
          initParticules();
        }
      }
    };

    if (canvas) {
      const parentEl = canvas.parentElement;
      const ctx = canvas.getContext("2d");

      if (parentEl) {
        canvas.height = parentEl.offsetHeight;
        canvas.width = parentEl.offsetWidth;

        if (ctx) {
          if (!particulesRef.current.length) initParticules();
          ctx.fillStyle = "#dc2626";
          const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particulesRef.current.length; i++) {
              update(particulesRef.current[i]);
              drawParticule(ctx, particulesRef.current[i]);
            }
            updateCursor(parentEl);
            drawCursor(ctx);
            rafRef.current = requestAnimationFrame(animate);
          };
          animate();
        }
      }
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    canvasRef,
    drawParticule,
    drawCursor,
    update,
    updateCursor,
    mouse,
    initParticules,
    isHover,
  ]);
};

export default useTheWallParticules;
