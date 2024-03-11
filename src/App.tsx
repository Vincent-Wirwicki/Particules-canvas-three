import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";

import HomePage from "./pages/0-home/HomePage";
import ErrorPage from "./pages/0-error/ErrorPage";

import CanvasPage from "./pages/1-canvas/CanvasPage";
import FBOPage from "./pages/2-FBO/FBOPage";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/canvas", element: <CanvasPage /> },
        { path: "/fbo", element: <FBOPage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
