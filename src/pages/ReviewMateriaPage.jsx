import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ReviewMateriaPage = () => {
  const { cargoId } = useParams();
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchMaterias();
  }, [cargoId]);

  const fetchMaterias = async () => {
    const materiasCollection = collection(db, "cargos", cargoId, "subjects");
    const materiasSnapshot = await getDocs(materiasCollection);

    const materiasList = await Promise.all(
      materiasSnapshot.docs.map(async (doc) => {
        const materiaData = doc.data();
        const topicsCollection = collection(db, "cargos", cargoId, "subjects", doc.id, "topics");
        const topicsSnapshot = await getDocs(topicsCollection);

        // Calcula o número total de questões e questões pendentes na matéria a partir dos tópicos
        let totalQuestions = 0;
        let pendingQuestions = 0;
        topicsSnapshot.docs.forEach((topicDoc) => {
          const topicData = topicDoc.data();
          totalQuestions += topicData.totalQuestions || 0;
          pendingQuestions += topicData.pendingQuestions || 0;
        });

        return {
          id: doc.id,
          subject: materiaData.subject || "Matéria sem título",
          totalQuestions,
          pendingQuestions,
        };
      })
    );

    setMaterias(materiasList);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matérias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materias.map((materia) => (
          <Link
            key={materia.id}
            to={`/revisao/cargo/${cargoId}/materia/${materia.id}`}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center"
          >
            <h3 className="font-semibold">{materia.subject}</h3>
            <p>{materia.totalQuestions} questões no total</p>
            {materia.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                {materia.pendingQuestions}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewMateriaPage;
