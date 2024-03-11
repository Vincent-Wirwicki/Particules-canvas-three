import React from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  paths: { title: string; path: string }[];
};

const MainNav: React.FC<Props> = ({ paths }) => {
  const location = useLocation();
  const filter = location.pathname.split("/")[1];

  return (
    <nav className="nav fixed-top-center">
      {paths.map(({ title, path }, idx) => (
        <Link
          key={idx}
          to={path}
          style={{
            color:
              title === filter || (title === "home" && filter === "")
                ? "#fafafa"
                : "#737373",
          }}
        >
          {title === filter || (title === "home" && filter === "")
            ? `| ${title} |`
            : title}
        </Link>
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
