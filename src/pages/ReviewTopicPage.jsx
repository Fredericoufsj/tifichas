import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ReviewTopicPage = () => {
  const { cargoId, materiaId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, [cargoId, materiaId]);

  const fetchTopics = async () => {
    const topicsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics");
    const topicsSnapshot = await getDocs(topicsCollection);

    const today = new Date();
    const topicsList = await Promise.all(
      topicsSnapshot.docs.map(async (doc) => {
        const topicData = doc.data();
        const questionsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics", doc.id, "questions");
        const questionsSnapshot = await getDocs(questionsCollection);

        // Conta o número de questões pendentes
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tópicos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/revisao/cargo/${cargoId}/materia/${materiaId}/topico/${topic.id}`}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center"
          >
            <h3 className="font-semibold">{topic.title}</h3>
            <p>{topic.totalQuestions} questões no total</p>
            {topic.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                {topic.pendingQuestions}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewTopicPage;
