import { Outlet } from "react-router-dom";

export const MorphPage = () => {
  return (
    <main className="page-center">
      <Outlet />
    </main>
  );
};
