import MouseOneScene from "../../particules/1-fbo/5-mouse/scene/MouseOneScene";
import Page from "../../layout/page/Page";

const MouseOnePage = () => {
  const notes = [
    {
      title: "1. Mouse",
      desc: "You can add mouse position do displace particles. My mouse is a litte offset because of some camera issue.",
    },
  ];
  return (
    <Page
      notes={notes}
      title="8. Mouse interaction"
      className="w-screen h-screen"
    >
      <MouseOneScene />
    </Page>
  );
};

export default MouseOnePage;
