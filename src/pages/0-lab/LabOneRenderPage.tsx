import Page from "../../layout/page/Page";
import LabOneRenderScene from "../../particules/1-fbo/0-lab/oneRender/scene/LabOneRenderFBO";

const LabOneRenderPage = () => {
  const notes = [
    {
      title: "1. Experiment",
      desc: "this page is for messing around",
    },
  ];
  return (
    <Page notes={notes} title="lab one render" className="w-screen h-screen">
      <LabOneRenderScene />
    </Page>
  );
};

export default LabOneRenderPage;
