import React, { useState } from "react";
import Burger from "./Burger";
import NavItems from "./NavItems";

type Props = {
  paths: { title: string; path: string }[];
};

const MainNav: React.FC<Props> = ({ paths }) => {
  // const location = useLocation();
  // const filter = location.pathname.split("/")[1];
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <>
      <nav className="nav">
        <div className="flex flex-col ">
          <NavItems paths={paths} isOpen={isOpen} />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="flex">
          <Burger isOpen={isOpen} />
        </button>
      </nav>
    </>
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
