import { Outlet } from "react-router-dom";
import MainNav from "./nav/MainNav";
import { mainNavPaths } from "../navPaths";

const Layout = () => {
  return (
    <>
      <MainNav paths={mainNavPaths} />
      <main className="page-canvas">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
