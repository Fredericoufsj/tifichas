// src/components/AddQuestionForm.jsx
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddQuestionForm = ({ cargoId, materiaId, topicoId }) => {
  const [front, setFront] = useState("");
  const [verso, setVerso] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Referência à coleção 'questions' do tópico específico
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

      // Adicionar nova questão
      await addDoc(questionsCollection, {
        front: front,
        verso: verso,
      });

      // Mensagem de sucesso e limpar campos
      setSuccessMessage("Questão adicionada com sucesso!");
      setFront("");
      setVerso("");
    } catch (error) {
      console.error("Erro ao adicionar questão:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Questão</h3>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
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
