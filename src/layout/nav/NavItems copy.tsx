import { useTrail, animated } from "react-spring";
import { NavLink } from "react-router-dom";

type Props = {
  paths: { title: string; path: string }[];
  isOpen: boolean;
};

const NavItems: React.FC<Props> = ({ paths, isOpen }) => {
  const stagger = useTrail(paths.length, {
    opacity: isOpen ? 1 : 0,
    x: isOpen ? 0 : -100,
  });

  return (
    <>
      {stagger.map(({ opacity, x }, i) => (
        <NavLink
          key={paths[i].title}
          to={paths[i].path}
          className={({ isActive }) =>
            isActive ? "text-amber-200 " : "text-neutral-200"
          }
        >
          <animated.div style={{ opacity, x }} className="nav-link">
            {paths[i].title}
          </animated.div>
        </NavLink>
      ))}
    </>
  );
};

export default NavItems;

// import { NavLink } from "react-router-dom";

// type Props = {
//   paths: { title: string; path: string }[];
// };

// const NavItems: React.FC<Props> = ({ paths }) => {
//   return (
//     <>
//       {paths.map(({ title, path }, i) => (
//         <NavLink
//           key={title + i}
//           to={path}
//           className={({ isActive }) =>
//             isActive ? "text-amber-200 " : "text-neutral-200"
//           }
//         >
//           <p className="nav-link">{title}</p>{" "}
//         </NavLink>
//       ))}
//     </>
//   );
// };

// export default NavItems;
