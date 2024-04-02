import { ReactNode } from "react";
import Notes from "../notes/Notes";
import DummyLoader from "../dummyLoader/DummyLoader";

type Props = {
  title: string;
  className?: string;
  notes: { title: string; desc: string }[];
  children: ReactNode;
};

const Page: React.FC<Props> = ({ className, children, title, notes }) => {
  return (
    <>
      <DummyLoader />
      <Notes notes={notes} />
      <h1 className=" page-title">{title}</h1>
      <div className={className}>{children}</div>
    </>
  );
};

export default Page;
