import { useState } from "react";
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
        <button onClick={() => setIsOpen(!isOpen)}>
          <Burger isOpen={isOpen} y={10} />
        </button>
        <div className="flex flex-col border-t border-dashed border-neutral-800 pt-1 ">
          <NavItems paths={paths} isOpen={isOpen} />
        </div>
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
