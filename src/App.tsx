import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";

import HomePage from "./pages/1-home/HomePage";
import ErrorPage from "./pages/0-error/ErrorPage";

import WipPage from "./pages/0-wip/WipPage";
import AttractorThreeScene from "./particules/1-fbo/4-attractor/3/scene/AttractorThreeScene";

// import CurlOnePage from "./pages/2-curlOne/CurlOnePage";
import CurlTwoPage from "./pages/3-curlTwo/CurlTwoPage";
import MorphOnePage from "./pages/4-morph/MorphOnePage";
import ModelOnePage from "./pages/5-model/ModelOnePage";
import AttractOnePage from "./pages/6-attractOne/AttractOnePage";
import AttractTwoPage from "./pages/7-attractTwo/AttractTwoPage";
import MouseOnePage from "./pages/8-mouse/MouseOnePage";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage />, index: true },
        { path: "wip", element: <WipPage /> },
        // { path: "curl-1", element: <CurlOnePage /> },
        { path: "curl-2", element: <CurlTwoPage /> },
        // { path: "curl-3", element: <CurlThreeScene /> },
        { path: "morph-1", element: <MorphOnePage /> },
        { path: "model-1", element: <ModelOnePage /> },
        { path: "attract-1", element: <AttractOnePage /> },
        { path: "attract-2", element: <AttractTwoPage /> },
        { path: "attract-3", element: <AttractorThreeScene /> },
        { path: "mouse-1", element: <MouseOnePage /> },
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
