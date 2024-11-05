// src/components/QuestionModal.jsx
import { useState, useEffect } from "react";

const QuestionModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [front, setFront] = useState("");
  const [verso, setVerso] = useState("");

  useEffect(() => {
    if (initialData) {
      setFront(initialData.front || "");
      setVerso(initialData.verso || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ front, verso });
    setFront("");
    setVerso("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">{initialData ? "Atualizar Questão" : "Nova Questão"}</h3>
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
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {initialData ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
