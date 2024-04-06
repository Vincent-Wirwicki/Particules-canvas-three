import Page from "../../layout/page/Page";
import AttractorOneScene from "../../particules/1-fbo/4-attractor/1/scene/AttractorOneScene";

const AttractOnePage = () => {
  const notes = [
    {
      title: "1. Attractor",
      desc: "It attracts particles between points. To make it works we need 2 render textures, so we can apply the attracting force to the particles.",
    },
  ];

  return (
    <Page
      notes={notes}
      title="6.Dadras Attractor"
      className="w-screen h-screen"
    >
      <AttractorOneScene />
    </Page>
  );
};

export default AttractOnePage;
