import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const AddQuestionForm = ({ cargoId, materiaId, topicoId, onQuestionAdded }) => {
  const [front, setFront] = useState("");
  const [verso, setVerso] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setErrorMessage("Usuário não autenticado.");
        return;
      }

      // Caminho correto para adicionar a questão
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

      await addDoc(questionsCollection, {
        front,
        verso,
        reviewed: false,
        nextReview: null,
        cargoId,
        materiaId,
        topicoId,
      });

      setSuccessMessage("Questão adicionada com sucesso!");
      setFront("");
      setVerso("");

      onQuestionAdded();
    } catch (error) {
      console.error("Erro ao adicionar questão:", error);
      setErrorMessage(`Erro ao adicionar questão: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Questão</h3>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Pergunta (Front)</label>
          <input
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Resposta (Verso)</label>
          <input
            type="text"
            value={verso}
            onChange={(e) => setVerso(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Adicionar Questão</button>
      </form>
    </div>
  );
};

export default AddQuestionForm;
