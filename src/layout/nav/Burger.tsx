import { animated, useSpring } from "react-spring";

type Props = {
  isOpen: boolean;
  y: number;
};

const Burger: React.FC<Props> = ({ isOpen, y }) => {
  const topLine = useSpring({
    // y: isOpen ? 0 : y * 0.5,
    y: 0,
    rotate: isOpen ? -45 : 180,
  });
  const botLine = useSpring({
    y: isOpen ? 0 : -y,
    rotate: isOpen ? 45 : 0,
  });

  return (
    <div className="nav-burger">
      <animated.span className="nav-burger-line" style={topLine} />
      <animated.span className="nav-burger-line" style={botLine} />
    </div>
  );
};

export default Burger;
