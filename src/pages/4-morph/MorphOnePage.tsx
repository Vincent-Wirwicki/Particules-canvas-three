import Page from "../../layout/page/Page";
import MorphOneScene from "../../particules/1-fbo/2-morph/1/scene/MorphOneScene";

const MorphOnePage = () => {
  const notes = [
    {
      title: "1. Morphing",
      desc: "You can morph from one shape to another by mixing their positions over time",
    },
  ];
  return (
    <Page notes={notes} title="4.morphing" className="page-canvas">
      <MorphOneScene />
    </Page>
  );
};

export default MorphOnePage;
