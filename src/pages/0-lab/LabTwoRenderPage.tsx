import Page from "../../layout/page/Page";
import LabTwoRenderScene from "../../particules/1-fbo/0-lab/twoRender/scene/LabTwoRenderScene";

const LabTwoRenderPage = () => {
  const notes = [
    {
      title: "1. Experiment",
      desc: "this page is for messing around",
    },
  ];
  return (
    <Page notes={notes} title="lab one render" className="w-screen h-screen">
      <LabTwoRenderScene />{" "}
    </Page>
  );
};

export default LabTwoRenderPage;
