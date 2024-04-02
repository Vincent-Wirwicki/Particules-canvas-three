import { useState } from "react";
import { animated, useSpring } from "react-spring";

type Props = {
  isOpen: boolean;
};

const Burger: React.FC<Props> = ({ isOpen }) => {
  const topLine = useSpring({ y: isOpen ? 0 : 10, rotate: isOpen ? -45 : 0 });
  const botLine = useSpring({
    y: isOpen ? 0 : 10,
    rotate: isOpen ? 45 : 0,
  });
  useState;
  return (
    <div className="relative h-10 w-10 border border-dashed border-neutral-800 flex justify-center items-center">
      <animated.span
        className="absolute w-5/6 h-[2px] bg-amber-200"
        style={topLine}
      />
      <animated.span
        className="absolute w-5/6 h-[2px] bg-amber-200"
        style={botLine}
      />
    </div>
  );
};

export default Burger;
