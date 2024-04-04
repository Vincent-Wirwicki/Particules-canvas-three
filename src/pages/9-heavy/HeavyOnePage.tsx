import Page from "../../layout/page/Page";
import HeavyOneScene from "../../particules/1-fbo/6-heavy/scene/HeavyOneScene";
const HeavyOnePage = () => {
  const notes = [
    {
      title: "1. Fractal Brownian Motion",
      desc: "FBM is a way to give more details to the noise, but it can be performance heavy, depending on noise you are using.",
    },
  ];
  return (
    <Page
      notes={notes}
      title="8. Mouse interaction"
      className="w-screen h-screen"
    >
      <HeavyOneScene />
    </Page>
  );
};

export default HeavyOnePage;
