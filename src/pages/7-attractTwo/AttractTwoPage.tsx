import Page from "../../layout/page/Page";
import AttractorTwoScene from "../../particules/1-fbo/4-attractor/2/scene/AttractorTwoScene";

const AttractTwoPage = () => {
  const notes = [
    {
      title: "1. Attractor",
      desc: "An other attractor, you can find many online. This time I added some offset value so all particles don't get caught.",
    },
  ];
  return (
    <Page
      notes={notes}
      title="7.Thomas attractor"
      className="w-screen h-screen"
    >
      <AttractorTwoScene />
    </Page>
  );
};

export default AttractTwoPage;
