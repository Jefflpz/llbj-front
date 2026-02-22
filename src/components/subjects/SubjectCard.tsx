interface SubjectCardProps {
  subject: any;
  active: boolean;
  onClick: () => void;
}

export default function SubjectCard({
  subject,
  active,
  onClick,
}: SubjectCardProps) {
  return (
    <div
      className={`subject-card-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="card-mini-info">
        <span className="mini-icon">📘</span>
        <div className="mini-text">
          <p className="mini-name">{subject.name}</p>
          <p className="mini-prof">Prof. {subject.teacherName}</p>
        </div>
      </div>
    </div>
  );
}
