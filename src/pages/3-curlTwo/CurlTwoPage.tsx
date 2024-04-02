import Page from "../../layout/page/Page";
import CurlTwoScene from "../../particules/1-fbo/0-noise/curl/2/scene/CurlTwoScene";

const CurlTwoPage = () => {
  const notes = [
    {
      title: "1. Curl noise",
      desc: "Curl noise looks awsome, but it's not performance friendly, because it computes other noise.",
    },
    {
      title: "2. Device Pixel Ratio",
      desc: "In this exemple I increase DPR to make the image more sharp at cost of performance",
    },
  ];
  return (
    <Page notes={notes} title="3.under control" className="page-canvas">
      <CurlTwoScene />
    </Page>
  );
};

export default CurlTwoPage;
