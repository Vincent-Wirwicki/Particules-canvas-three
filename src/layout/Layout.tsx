import { Outlet } from "react-router-dom";
import MainNav from "./nav/MainNav";
import { mainNavPaths } from "../navPaths";
import Socials from "./socials/Socials";
import DummyLoader from "./dummyLoader/DummyLoader";

const Layout = () => {
  return (
    <>
      <MainNav paths={mainNavPaths} />
      <Socials />
      <DummyLoader/>
      <main className="page-canvas">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
