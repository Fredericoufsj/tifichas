// src/pages/SubjectPage.jsx
import { Link, useParams } from "react-router-dom";
import { flashcards } from "../data/flashcards";

const SubjectPage = () => {
  const { cargoId, materiaId } = useParams();
  const subject = flashcards[cargoId].subjects[materiaId];

  return (
    <div className="min-h-screen bg-lightGray p-6">
      <h2 className="text-3xl font-bold text-center">{subject.subject}</h2>
      <div className="mt-8 flex flex-col items-center space-y-4">
        {subject.topics.map((topic, index) => (
          <Link
            key={index}
            to={`/cargo/${cargoId}/materia/${materiaId}/topico/${index}`}
            className="text-lg font-semibold text-pureBlack p-4 rounded bg-white shadow-md"
          >
            {topic.topic}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
