import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReviewTopicPage = () => {
  const { cargoId, materiaId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, [cargoId, materiaId]);

  const fetchTopics = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    // Ajuste para acessar os tópicos dentro de `users/{userId}/cargos/{cargoId}/subjects/{materiaId}/topics`
    const topicsCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects", materiaId, "topics");
    const topicsSnapshot = await getDocs(topicsCollection);

    const today = new Date();
    const topicsList = await Promise.all(
      topicsSnapshot.docs.map(async (doc) => {
        const topicData = doc.data();
        const questionsCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects", materiaId, "topics", doc.id, "questions");
        const questionsSnapshot = await getDocs(questionsCollection);

        // Calcular questões pendentes
        const pendingQuestions = questionsSnapshot.docs.filter((questionDoc) => {
          const nextReviewDate = questionDoc.data().nextReview ? questionDoc.data().nextReview.toDate() : null;
          return !nextReviewDate || nextReviewDate <= today;
        }).length;

        return {
          id: doc.id,
          title: topicData.title || "Tópico sem título",
          totalQuestions: topicData.totalQuestions || 0,
          pendingQuestions,
        };
      })
    );

    setTopics(topicsList);
  };

  return (
    <div className="p-6 ml-20 md:ml-0">
      <h2 className="text-2xl font-bold mb-6 text-center">Tópicos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/revisao/cargo/${cargoId}/materia/${materiaId}/topico/${topic.id}`}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col w-full max-w-xs items-center"
          >
            <h3 className="font-semibold text-lg text-center mb-2">{topic.title}</h3>
            <p className="text-gray-600 text-sm">{topic.totalQuestions} questões no total</p>
            {topic.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-3 py-1 mt-2 text-xs font-bold">
                {topic.pendingQuestions} pendentes
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewTopicPage;
