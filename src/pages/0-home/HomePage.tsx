// import CloudsParticules from "../../particules/0-canvas/0-clouds/CloudsParticules";translate-x-[-50%] translate-y-[-50%]fixed top-2/4 left-1/4 text-6xl  font-light  tracking-wider
import TorusKnotScene from "../../particules/1-fbo/1-shapes/1-TorusKnot/scene/TorusKnotScene";

const HomePage = () => {
  return (
    <main className="page-fixed flex flex-col gap-2 justify-center items-center ">
      <div>
        <h1 className="text-4xl tracking-wider">Particules</h1>
        <h3 className="">
          An experimental project
          <br />
        </h3>
      </div>
      <div className="absolute-center tracking-wider"></div>
      <div className="fixed top-0 left-0  h-screen w-screen">
        <TorusKnotScene />
      </div>
    </main>
  );
};

export default HomePage;
