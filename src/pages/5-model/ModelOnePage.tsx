import Page from "../../layout/page/Page";
import BustScene from "../../particules/1-fbo/3-model/1-bust/scene/BustScene";

const ModelOnePage = () => {
  const notes = [
    {
      title: "1. 3D model",
      desc: "You can extract data point from a 3D model to get particles positions. You also need a high detail model.",
    },
    {
      title: "2. DepthTest",
      desc: "DephTest need to be set to true or the render will look akward.",
    },
  ];
  return (
    <Page notes={notes} title="5.bust" className="w-screen h-screen">
      <BustScene />
    </Page>
  );
};

export default ModelOnePage;
