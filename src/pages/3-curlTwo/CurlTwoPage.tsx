import Page from "../../layout/page/Page";
import CurlTwoScene from "../../particules/1-fbo/0-noise/curl/2/scene/CurlTwoScene";

const CurlTwoPage = () => {
  const notes = [
    {
      title: "1. Curl noise",
      desc: "Curl noise are awesome, but they are heavy to compute.",
    },
    {
      title: "2. Device Pixel Ratio",
      desc: "Increasing DPR increase image resolution at cost of performance.",
    },
  ];
  return (
    <Page notes={notes} title="3.under control" className="page-canvas">
      <CurlTwoScene />
    </Page>
  );
};

export default CurlTwoPage;
