import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
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

  // Função para atualizar o total de questões no tópico
  const updateTopicTotalQuestions = async () => {
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
    const totalQuestions = questionsSnapshot.size;

    const topicRef = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId);
    await updateDoc(topicRef, { totalQuestions });

    // Após atualizar o tópico, atualize a matéria
    await updateMateriaTotalQuestions();
  };

  // Função para atualizar o total de questões na matéria
  const updateMateriaTotalQuestions = async () => {
    const topicsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics");
    const topicsSnapshot = await getDocs(topicsCollection);

    let totalQuestions = 0;
    topicsSnapshot.forEach((doc) => {
      totalQuestions += doc.data().totalQuestions || 0;
    });

    const materiaRef = doc(db, "cargos", cargoId, "subjects", materiaId);
    await updateDoc(materiaRef, { totalQuestions });

    // Após atualizar a matéria, atualize o cargo
    await updateCargoTotalQuestions();
  };

  // Função para atualizar o total de questões no cargo
  const updateCargoTotalQuestions = async () => {
    const materiasCollection = collection(db, "cargos", cargoId, "subjects");
    const materiasSnapshot = await getDocs(materiasCollection);

    let totalQuestions = 0;
    materiasSnapshot.forEach((doc) => {
      totalQuestions += doc.data().totalQuestions || 0;
    });

    const cargoRef = doc(db, "cargos", cargoId);
    await updateDoc(cargoRef, { totalQuestions });
  };

  // Atualizar a lista de perguntas após adicionar uma nova
  const handleQuestionAdded = () => {
    fetchQuestions(); // Atualiza a lista de perguntas
    updateTopicTotalQuestions(); // Atualiza o total de questões no tópico e propaga
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
