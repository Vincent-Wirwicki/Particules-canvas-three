import { useState } from "react";
import { useTrail, animated } from "react-spring";
import Burger from "../nav/Burger";

type Props = {
  notes: { title: string; desc: string }[];
};

const Notes: React.FC<Props> = ({ notes }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const stagger = useTrail(notes.length, {
    opacity: isOpen ? 1 : 0,
    // width: isOpen ? 192 : 140,
    x: isOpen ? 0 : -200,
    // clipPath: isOpen ? "inset(0)" : "inset(100% 0 0 0)",
  });
  return (
    <div
      className="notes-wrap z-50 "
      // style={{ height: isOpen ? "fit-content" : 20 }}
    >
      {stagger.map(({ opacity, x }, i) => (
        <animated.div
          key={notes[i].title + i}
          className="notes-sub-wrap"
          style={{ opacity, x }}
        >
          <h3 className="notes-sub-title">{notes[i].title}</h3>{" "}
          <p className="notes-sub-desc">{notes[i].desc}</p>
        </animated.div>
      ))}
      <div className="flex gap-2 items-end border-b border-neutral-800 border-dashed">
        <button className=" pb-2" onClick={() => setIsOpen(!isOpen)}>
          <Burger isOpen={isOpen} y={-10} />
        </button>
        <h3 className="pb-2">Notes</h3>
      </div>
    </div>
  );
};

export default Notes;
