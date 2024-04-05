type Props = {
  notes: { title: string; desc: string }[];
};

const Notes: React.FC<Props> = ({ notes }) => {
  return (
    <div className="notes-wrap ">
      <div className="flex justify-between items-end border-b border-neutral-800 border-dashed">
        <h3 className="notes-title">Notes</h3>
        <div className="border border-neutral-800 border-dashed p-1">+</div>
      </div>
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
