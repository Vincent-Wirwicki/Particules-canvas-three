import Page from "../../layout/page/Page";
import HeavyOneScene from "../../particules/1-fbo/6-heavy/scene/HeavyOneScene";
const HeavyOnePage = () => {
  const notes = [
    {
      title: "1. Fractal Brownian Motion",
      desc: "FBM make noise more detailed, but it can be performance heavy, depending on the noise you use.",
    },
  ];
  return (
    <Page notes={notes} title="8.FBM curl noise" className="w-screen h-screen">
      <HeavyOneScene />
    </Page>
  );
};

export default HeavyOnePage;
