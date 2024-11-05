// src/components/TopicModal.jsx
import { useState, useEffect } from "react";

const TopicModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title });
    setTitle("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">{initialData ? "Atualizar Tópico" : "Novo Tópico"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nome do Tópico</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

export default TopicModal;
