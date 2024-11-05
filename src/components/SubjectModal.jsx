// src/components/SubjectModal.jsx
import { useState, useEffect } from "react";

const SubjectModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ subject });
    setSubject("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h3 className="text-xl font-semibold mb-4">{initialData ? "Atualizar Matéria" : "Nova Matéria"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nome da Matéria</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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

export default SubjectModal;
