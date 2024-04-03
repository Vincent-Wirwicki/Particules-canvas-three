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

  return (
    <div className="nav-burger">
      <animated.span className="nav-burger-line" style={topLine} />
      <animated.span className="nav-burger-line" style={botLine} />
    </div>
  );
};

export default Burger;
