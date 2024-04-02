import { useTrail, animated } from "react-spring";
import { NavLink } from "react-router-dom";

type Props = {
  paths: { title: string; path: string }[];
  isOpen: boolean;
};

const NavItems: React.FC<Props> = ({ paths, isOpen }) => {
  const stagger = useTrail(paths.length, {
    opacity: isOpen ? 1 : 0,
    // x: isOpen ? 0 : -20,
    config: { mass: 5, tension: 2000, friction: 200 },
  });
  return (
    <>
      {stagger.map(({ opacity }, i) => (
        <NavLink
          key={paths[i].path}
          to={paths[i].path}
          className={({ isActive }) =>
            isActive ? "text-amber-200 " : "text-neutral-200"
          }
        >
          <animated.div style={{ opacity }} className="nav-link">
            {paths[i].title}
          </animated.div>
        </NavLink>
      ))}
    </>
  );
};

export default NavItems;
