// src/pages/QuestionReviewPage.jsx
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import FlashCard from "../components/FlashCard";

const QuestionReviewPage = ({ questionId }) => {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const fetchQuestion = async () => {
    const questionDoc = doc(db, "questions", questionId);
    const questionSnapshot = await getDoc(questionDoc);
    setQuestion({ id: questionSnapshot.id, ...questionSnapshot.data() });
  };

  const handleReviewResponse = async (days) => {
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + days);

    await updateDoc(doc(db, "questions", questionId), {
      nextReview: nextReviewDate,
    });
    alert("Revisão registrada!");
  };

  if (!question) return <p>Carregando...</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Revisão de Questão</h2>
      <FlashCard title={question.front} description={question.verso} />
      <div className="flex space-x-4 mt-6">
        <button onClick={() => handleReviewResponse(1)} className="bg-red-500 text-white p-2 rounded">Não Lembrei (+1 dia)</button>
        <button onClick={() => handleReviewResponse(3)} className="bg-yellow-500 text-white p-2 rounded">Lembrei Parcialmente (+3 dias)</button>
        <button onClick={() => handleReviewResponse(7)} className="bg-green-500 text-white p-2 rounded">Lembrei Bem (+7 dias)</button>
        <button onClick={() => handleReviewResponse(15)} className="bg-blue-500 text-white p-2 rounded">Lembrei Facilmente (+15 dias)</button>
      </div>
    </div>
  );
};

export default QuestionReviewPage;
