import { NavLink } from "react-router-dom";

type Props = {
  paths: { title: string; path: string }[];
};

const NavItems: React.FC<Props> = ({ paths }) => {
  return (
    <>
      {paths.map(({ title, path }, i) => (
        <NavLink
          key={title + i}
          to={path}
          className={({ isActive }) =>
            isActive ? "text-amber-200 " : "text-neutral-200"
          }
        >
          <p className="nav-link">{title}</p>{" "}
        </NavLink>
      ))}
    </>
  );
};

export default NavItems;
