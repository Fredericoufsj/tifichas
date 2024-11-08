import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReviewMateriaPage = () => {
  const { cargoId } = useParams();
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchMaterias();
  }, [cargoId]);

  const fetchMaterias = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    // Ajuste para acessar as matérias dentro de `users/{userId}/cargos/{cargoId}/subjects`
    const materiasCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects");
    const materiasSnapshot = await getDocs(materiasCollection);

    const today = new Date();
    const materiasList = await Promise.all(
      materiasSnapshot.docs.map(async (doc) => {
        const materiaData = doc.data();
        const topicsCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects", doc.id, "topics");
        const topicsSnapshot = await getDocs(topicsCollection);

        let totalQuestions = 0;
        let pendingQuestions = 0;

        // Calcular total de questões e questões pendentes usando a lógica correta
        for (const topicDoc of topicsSnapshot.docs) {
          const topicData = topicDoc.data();
          const questionsCollection = collection(
            db,
            "users",
            user.uid,
            "cargos",
            cargoId,
            "subjects",
            doc.id,
            "topics",
            topicDoc.id,
            "questions"
          );
          const questionsSnapshot = await getDocs(questionsCollection);

          const pendingQuestionsCount = questionsSnapshot.docs.filter((questionDoc) => {
            const nextReviewDate = questionDoc.data().nextReview ? questionDoc.data().nextReview.toDate() : null;
            return !nextReviewDate || nextReviewDate <= today;
          }).length;

          totalQuestions += topicData.totalQuestions || questionsSnapshot.docs.length;
          pendingQuestions += pendingQuestionsCount;
        }

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
    <div className="p-6 ml-20 md:ml-0">
      <h2 className="text-2xl font-bold mb-6 text-center">Matérias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {materias.map((materia) => (
          <Link
            key={materia.id}
            to={`/revisao/cargo/${cargoId}/materia/${materia.id}`}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col w-full max-w-xs items-center"
          >
            <h3 className="font-semibold text-lg text-center mb-2">{materia.subject}</h3>
            <p className="text-gray-600 text-sm">{materia.totalQuestions} questões no total</p>
            {materia.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-3 py-1 mt-2 text-xs font-bold">
                {materia.pendingQuestions} pendentes
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewMateriaPage;
