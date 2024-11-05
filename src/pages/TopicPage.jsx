// src/pages/TopicPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import FlashCard from "../components/FlashCard";
import AddQuestionForm from "../components/AddQuestionForm";

const TopicPage = () => {
  const { cargoId, materiaId, topicoId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
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
    setQuestions(questionsList);
  };

  // Atualizar a lista de perguntas após adicionar uma nova
  const handleQuestionAdded = () => {
    fetchQuestions(); // Atualiza a lista de perguntas
    setShowForm(false); // Fecha o formulário
  };

  return (
    <div className="min-h-screen bg-lightGray p-6">
      <h2 className="text-3xl font-bold text-center">Perguntas</h2>
      
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {questions.map((question) => (
          <FlashCard
            key={question.id}
            title={question.front}
            description={question.verso}
            onEdit={() => console.log("Editar", question.id)}
            onDelete={() => console.log("Deletar", question.id)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white p-3 rounded"
        >
          {showForm ? "Cancelar" : "Adicionar Nova Questão"}
        </button>
      </div>

      {/* Formulário para adicionar nova questão */}
      {showForm && (
        <div className="mt-8 flex justify-center">
          <AddQuestionForm
            cargoId={cargoId}
            materiaId={materiaId}
            topicoId={topicoId}
            onQuestionAdded={handleQuestionAdded}
          />
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white p-3 rounded">
          Voltar
        </button>
      </div>
    </div>
  );
};

export default TopicPage;
