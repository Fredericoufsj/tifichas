import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDoc, doc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import FlashCard from "../components/FlashCard";
import AddQuestionForm from "../components/AddQuestionForm";

const TopicPage = () => {
  const { cargoId, materiaId, topicoId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editVerso, setEditVerso] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserQuestions();
    fetchUserRole();
  }, [cargoId, materiaId, topicoId]);

  const fetchUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }
    }
  };

  const fetchUserQuestions = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const questionsCollection = collection(
      db,
      "users",
      user.uid,
      "cargos",
      cargoId,
      "subjects",
      materiaId,
      "topics",
      topicoId,
      "questions"
    );
    const questionsSnapshot = await getDocs(questionsCollection);
    const questionsList = questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      const auth = getAuth();
      const user = auth.currentUser;

      const questionRef = doc(
        db,
        "users",
        user.uid,
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

      fetchUserQuestions();
      setEditingQuestion(null);
    } catch (error) {
      console.error("Erro ao editar questão:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const questionRef = doc(
        db,
        "users",
        user.uid,
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

      fetchUserQuestions();
    } catch (error) {
      console.error("Erro ao deletar questão:", error);
    }
  };

  const handleQuestionAdded = () => {
    setShowForm(false);
    setShowSuccessAlert(true);

    // Ocultar o alerta após 3 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);

    fetchUserQuestions();
  };

  return (
    <div className="min-h-screen bg-lightGray p-6">
      <h2 className="text-3xl font-bold text-center">Perguntas</h2>

      {/* Alerta de sucesso */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          <strong>Questão adicionada com sucesso!</strong>
        </div>
      )}

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

      {userRole === "admin" && (
        <div className="flex justify-center mt-8">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white p-3 rounded">
            {showForm ? "Cancelar" : "Adicionar Nova Questão"}
          </button>
        </div>
      )}

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
