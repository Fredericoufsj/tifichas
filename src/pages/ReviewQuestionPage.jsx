import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDocs, getDoc, collection, increment } from "firebase/firestore";
import FlashCard from "../components/FlashCard";

const ReviewQuestionPage = () => {
  const { cargoId, materiaId, topicoId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

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

    const today = new Date();
    const questionsList = questionsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((question) => {
        const nextReviewDate = question.nextReview ? question.nextReview.toDate() : null;
        return !nextReviewDate || nextReviewDate <= today;
      });

    if (questionsList.length === 0) {
      setShowCongratsModal(true);
      setTimeout(() => navigate(-1), 3000);
    } else {
      setQuestions(questionsList);
    }
  };

  const fetchProgress = async () => {
    const topicDocRef = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId);
    const topicSnapshot = await getDoc(topicDocRef);
    if (topicSnapshot.exists()) {
      const data = topicSnapshot.data();
      const calculatedProgress = (data.completedQuestions / data.totalQuestions) * 100;
      setProgress(calculatedProgress);
    }
  };

  const handleReviewResponse = async (days) => {
    const questionId = questions[currentIndex].id;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + days);
  
    const questionRef = doc(
      db,
      "cargos",
      cargoId,
      "subjects",
      materiaId,
      "topics",
      topicoId,
      "questions",
      questionId
    );
  
    // Atualizar a questão específica com a nova data de revisão
    await updateDoc(questionRef, {
      nextReview: nextReviewDate,
      reviewed: true,
    });
  
    // Atualizar pendências no tópico
    const topicRef = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId);
    await updateDoc(topicRef, {
      pendingQuestions: increment(-1),
      completedQuestions: increment(1),
    });
  
    // Propagar a atualização para o subject
    const subjectRef = doc(db, "cargos", cargoId, "subjects", materiaId);
    await updateDoc(subjectRef, {
      pendingQuestions: increment(-1),
      completedQuestions: increment(1),
    });
  
    // Propagar a atualização para o cargo
    const cargoRef = doc(db, "cargos", cargoId);
    await updateDoc(cargoRef, {
      pendingQuestions: increment(-1),
      completedQuestions: increment(1),
    });
  
    // Atualizar progresso localmente no frontend para refletir as mudanças
    const topicSnapshot = await getDoc(topicRef);
    if (topicSnapshot.exists()) {
      const data = topicSnapshot.data();
      const newProgress = (data.completedQuestions / data.totalQuestions) * 100;
      setProgress(newProgress);
    }
  
    // Avançar para a próxima questão ou exibir o modal de parabéns
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowCongratsModal(true);
      setTimeout(() => {
        navigate(-1); // Redireciona para a página anterior (Tópicos)
      }, 3000); // Exibe o modal por 3 segundos antes de redirecionar
    }
  };
  

  if (questions.length === 0 && !showCongratsModal) return <p>Carregando questões...</p>;

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

      {/* Modal de Parabéns */}
      {showCongratsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <span role="img" aria-label="confetti" className="text-4xl">🎉</span>
            <h3 className="text-xl font-bold mt-4">Parabéns!</h3>
            <p>Você não possui nenhuma revisão pendente!</p>
          </div>
        </div>
      )}

      {!showCongratsModal && questions.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ReviewQuestionPage;
