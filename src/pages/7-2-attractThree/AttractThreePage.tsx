import Page from "../../layout/page/Page";
import AttractorThreeScene from "../../particules/1-fbo/4-attractor/3/scene/AttractorThreeScene";

const AttractThreePage = () => {
  const notes = [
    {
      title: "1. Attractor",
      desc: "Another attractor, trying to make a gif",
    },
  ];
  return (
    <Page
      notes={notes}
      title="8.Halvorsen Attractor"
      className="w-screen h-screen"
    >
      <AttractorThreeScene />
    </Page>
  );
};

export default AttractThreePage;
