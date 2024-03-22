import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";

import HomePage from "./pages/0-home/HomePage";
import ErrorPage from "./pages/0-error/ErrorPage";

import CanvasPage from "./pages/1-canvas/CanvasPage";
import FBOPage from "./pages/2-FBO/FBOPage";

// const CurlOneFBOParticules = lazy(
//   () =>
//     import("./particules/1-fbo/0-noise/curl/1/particules/CurlOneFBOParticules")
// );

import CurlOneScene from "./particules/1-fbo/0-noise/curl/1/scene/CurlOneScene";
import CurlTwoScene from "./particules/1-fbo/0-noise/curl/2/scene/CurlTwoScene";
import CurlThreeScene from "./particules/1-fbo/0-noise/curl/3/scene/CurlThreeScene";

import FBMOneScene from "./particules/1-fbo/0-noise/fbm/1/scene/FBMOneScene";
import WipPage from "./pages/0-wip/WipPage";
import MorphOneScene from "./particules/1-fbo/2-morph/1/scene/MorphOneScene";
import BustScene from "./particules/1-fbo/3-model/1-bust/scene/BustScene";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "wip", element: <WipPage /> },
        { path: "/", element: <HomePage /> },
        { path: "/canvas", element: <CanvasPage /> },
        {
          path: "/fbo",
          element: <FBOPage />,
          children: [
            {
              path: "curl-1",
              element: <CurlOneScene />,
            },
            {
              path: "curl-2",
              element: <CurlTwoScene />,
            },
            {
              path: "curl-3",
              element: <CurlThreeScene />,
            },
            {
              path: "fbm",
              element: <FBMOneScene />,
            },
            {
              path: "morph-1",
              element: <MorphOneScene />,
            },
            {
              path: "model-1",
              element: <BustScene />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
// element: (
//   <Suspense fallback={null}>
//     <CurlOneFBOParticules />
//   </Suspense>
// ),
