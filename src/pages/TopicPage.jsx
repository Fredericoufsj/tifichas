import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import FlashCard from "../components/FlashCard";
import AddQuestionForm from "../components/AddQuestionForm";

const TopicPage = () => {
  const { cargoId, materiaId, topicoId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // Estado para controlar a edição
  const [editFront, setEditFront] = useState("");
  const [editVerso, setEditVerso] = useState("");
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

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditFront(question.front);
    setEditVerso(question.verso);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      const questionRef = doc(
        db,
        "cargos",
        cargoId,
        "subjects",
        materiaId,
        "topics",
        topicoId,
        "questions",
        editingQuestion
      );
      await updateDoc(questionRef, {
        front: editFront,
        verso: editVerso,
      });
      console.log("Question edited successfully");

      // Atualizar a lista de perguntas após a edição
      fetchQuestions();
      setEditingQuestion(null); // Fecha o modo de edição
    } catch (error) {
      console.error("Erro ao editar questão:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const questionRef = doc(
        db,
        "cargos",
        cargoId,
        "subjects",
        materiaId,
        "topics",
        topicoId,
        "questions",
        id
      );
      await deleteDoc(questionRef);
      console.log("Question deleted successfully");

      // Atualizar a lista de perguntas após a exclusão
      fetchQuestions();
    } catch (error) {
      console.error("Erro ao deletar questão:", error);
    }
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
            onEdit={() => handleEdit(question)}
            onDelete={() => handleDelete(question.id)}
          />
        ))}
      </div>

      {/* Formulário de Edição */}
      {editingQuestion && (
        <div className="flex justify-center mt-8">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Editar Questão</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Pergunta (Front)</label>
              <input
                type="text"
                value={editFront}
                onChange={(e) => setEditFront(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Resposta (Verso)</label>
              <input
                type="text"
                value={editVerso}
                onChange={(e) => setEditVerso(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditingQuestion(null)} className="bg-gray-500 text-white p-2 rounded">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white p-3 rounded"
        >
          {showForm ? "Cancelar" : "Adicionar Nova Questão"}
        </button>
      </div>

      {showForm && (
        <div className="mt-8 flex justify-center">
          <AddQuestionForm
            cargoId={cargoId}
            materiaId={materiaId}
            topicoId={topicoId}
            onQuestionAdded={fetchQuestions}
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
