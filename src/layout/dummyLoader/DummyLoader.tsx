import { useSpring, animated } from "@react-spring/web";

const DummyLoader = () => {
  const props = useSpring({
    from: { opacity: 1, display: "flex" },
    to: { opacity: 0, display: "none" },
    delay: 800,
  });

  const props2 = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 500,
    config: {
      duration: 300,
    },
  });

  return (
    <animated.div style={props} className="loader-dummy">
      <animated.span style={props2}>Loading</animated.span>
    </animated.div>
  );
};

export default DummyLoader;
