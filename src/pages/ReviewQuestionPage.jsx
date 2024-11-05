import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDocs, getDoc, collection, increment } from "firebase/firestore";
import FlashCard from "../components/FlashCard";

const ReviewQuestionPage = () => {
  const { cargoId, materiaId, topicoId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchQuestions();
    fetchProgress();
  }, [cargoId, materiaId, topicoId]);

  const fetchQuestions = async () => {
    const questionsCollection = collection(
      db,
      "cargos",
      cargoId,
      "subjects",
      materiaId,
      "topics",
      topicoId,
      "questions"
    );
    const questionsSnapshot = await getDocs(questionsCollection);
    const questionsList = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched questions:", questionsList); // Verifica as questões carregadas
    setQuestions(questionsList);
  };

  const fetchProgress = async () => {
    const topicDocRef = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId);
    const topicSnapshot = await getDoc(topicDocRef);
    if (topicSnapshot.exists()) {
      const data = topicSnapshot.data();
      const calculatedProgress = (data.completedQuestions / data.totalQuestions) * 100;
      setProgress(calculatedProgress);
      console.log("Progress fetched:", calculatedProgress); // Verifica o progresso inicial
    }
  };

  const handleReviewResponse = async (days) => {
    const questionId = questions[currentIndex].id;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + days);

    // Atualiza a data de revisão da questão
    await updateDoc(doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId, "questions", questionId), {
      nextReview: nextReviewDate,
      reviewed: true,
    });

    // Atualiza o progresso do tópico e incrementa o contador de questões concluídas
    const topicDocRef = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId);
    const topicSnapshot = await getDoc(topicDocRef);
    if (topicSnapshot.exists() && !questions[currentIndex].reviewed) {
      const data = topicSnapshot.data();
      const newCompletedQuestions = (data.completedQuestions || 0) + 1;
      await updateDoc(topicDocRef, {
        completedQuestions: increment(1),
      });
      console.log("Incremented completedQuestions:", newCompletedQuestions); // Verifica o incremento
      setProgress((newCompletedQuestions / data.totalQuestions) * 100);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Revisão concluída para este tópico!");
    }
  };

  if (questions.length === 0) return <p>Carregando questões...</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Revisão de Questões</h2>

      <div className="w-full max-w-xl h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        >
          <span className="text-white text-xs font-semibold pl-2">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <FlashCard
        title={questions[currentIndex].front}
        description={questions[currentIndex].verso}
      />

      <div className="flex space-x-4 mt-6">
        <button onClick={() => handleReviewResponse(1)} className="bg-red-500 text-white p-2 rounded">
          Não Lembrei (+1 dia)
        </button>
        <button onClick={() => handleReviewResponse(3)} className="bg-yellow-500 text-white p-2 rounded">
          Lembrei Parcialmente (+3 dias)
        </button>
        <button onClick={() => handleReviewResponse(7)} className="bg-green-500 text-white p-2 rounded">
          Lembrei Bem (+7 dias)
        </button>
        <button onClick={() => handleReviewResponse(15)} className="bg-blue-500 text-white p-2 rounded">
          Lembrei Facilmente (+15 dias)
        </button>
      </div>
    </div>
  );
};

export default ReviewQuestionPage;
