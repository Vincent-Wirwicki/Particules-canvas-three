import { Outlet } from "react-router-dom";

const NoisePage = () => {
  return (
    <main className="page-center">
      <Outlet />
    </main>
  );
};

export default NoisePage;
