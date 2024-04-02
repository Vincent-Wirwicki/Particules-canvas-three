import Page from "../../layout/page/Page";
import CurlOneScene from "../../particules/1-fbo/0-noise/curl/1/scene/CurlOneScene";

const CurlOnePage = () => {
  const notes = [
    {
      title: "1. Curl noise",
      desc: "A heavy noise made of many noise. It can get out of control pretty fast.",
    },
    {
      title: "2. Device Pixel Ratio",
      desc: "Increasing the DPR increase the image resolution at cost of performance.",
    },
  ];
  return (
    <Page notes={notes} title="2.Out of control" className="w-screen h-screen">
      <CurlOneScene />
    </Page>
  );
};

export default CurlOnePage;
