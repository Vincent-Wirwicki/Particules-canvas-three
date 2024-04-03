import Page from "../../layout/page/Page";
import TorusKnotScene from "../../particules/1-fbo/1-shapes/1-TorusKnot/scene/TorusKnotScene";

const HomePage = () => {
  const notes = [
    {
      title: "1. Particles",
      desc: "Particles are an array of coordinates (x,y,z). You can draw any shape by calculating these points. Complex calculation can impact performance.",
    },
    {
      title: "2. Frame Buffer Output",
      desc: "FBO, force animation on your GPU. The result is sent as an image to your canvas. It's like taking photos of your GPU doing math.",
    },
  ];
  return (
    <Page notes={notes} title="1.Torus Knot" className="w-screen h-screen">
      <TorusKnotScene />
    </Page>
  );
};

export default HomePage;
