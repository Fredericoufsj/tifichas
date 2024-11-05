import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const ReviewTopicPage = () => {
  const { cargoId, materiaId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, [cargoId, materiaId]);

  const fetchTopics = async () => {
    const topicsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics");
    const topicsSnapshot = await getDocs(topicsCollection);

    const topicsList = topicsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || "Tópico sem título",
      totalQuestions: doc.data().totalQuestions || 0, // Usa o valor direto do Firestore
    }));
    console.log("Topics fetched:", topicsList); // Verifica o totalQuestions de cada cargo

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
            className="bg-white p-4 rounded shadow-md"
          >
            <h3 className="font-semibold">{topic.title}</h3>
            <p>{topic.totalQuestions} questões no total</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewTopicPage;
