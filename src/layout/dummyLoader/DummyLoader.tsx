import { useSpring, animated } from "@react-spring/web";

const DummyLoader = () => {
  const props = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 800,
    // config: {
    //   duration: 800,
    // },
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
    <animated.div
      style={props}
      className="fixed top-0 left-0 z-50 w-screen h-screen bg-neutral-950  origin-top flex justify-center items-center text-neutral-200"
    >
      <animated.span style={props2}>Loading</animated.span>
    </animated.div>
  );
};

export default DummyLoader;
