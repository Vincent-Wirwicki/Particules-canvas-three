import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  paths: { title: string; path: string }[];
};

const MainNav: React.FC<Props> = ({ paths }) => {
  // const location = useLocation();
  // const filter = location.pathname.split("/")[1];

  return (
    <nav className="nav">
      {paths.map(({ title, path }, idx) => (
        <NavLink
          key={idx}
          to={path}
          className={({ isActive }) =>
            isActive ? "text-amber-200 nav-link" : "text-neutral-200 nav-link"
          }
        >
          {title}
        </NavLink>
      ))}
    </nav>
  );
};

export default MainNav;
// {
//   title === filter || (title === "home" && filter === "")
//     ? `[${title}]`
//     : title;
// }
// `nav-link ${
//   title === filter || (title === "home" && filter === "")
//     ? "text-emerald-400"
//     : "text-neutral-200"
// } `;
