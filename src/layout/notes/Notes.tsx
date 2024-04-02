type Props = {
  notes: { title: string; desc: string }[];
};

const Notes: React.FC<Props> = ({ notes }) => {
  return (
    <div className="notes-wrap ">
      <h3 className="notes-title">Notes</h3>
      {notes.map(({ title, desc }, idx) => (
        <div key={title + idx} className="notes-sub-wrap">
          <h3 className="notes-sub-title">{title}</h3>{" "}
          <p className="notes-sub-desc">{desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Notes;
