import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaEdit, FaTrash } from "react-icons/fa";

const CargoPage = () => {
  const { cargoId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectTitle, setEditSubjectTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchSubjects();
  }, [cargoId]);

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

  const fetchSubjects = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    const subjectsCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects");
    const subjectsSnapshot = await getDocs(subjectsCollection);
    const subjectsList = subjectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSubjects(subjectsList);
  };

  const handleAddSubject = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    try {
      const subjectsCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects");
      await addDoc(subjectsCollection, {
        subject: newSubjectTitle,
      });
      setNewSubjectTitle("");
      setShowForm(false);
      fetchSubjects();
    } catch (error) {
      console.error("Erro ao adicionar matéria:", error);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject.id);
    setEditSubjectTitle(subject.subject);
  };

  const handleEditSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !editingSubject) return;

    try {
      const subjectDoc = doc(db, "users", user.uid, "cargos", cargoId, "subjects", editingSubject);
      await updateDoc(subjectDoc, {
        subject: editSubjectTitle,
      });
      setEditingSubject(null);
      setEditSubjectTitle("");
      fetchSubjects();
    } catch (error) {
      console.error("Erro ao editar matéria:", error);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    try {
      const subjectDoc = doc(db, "users", user.uid, "cargos", cargoId, "subjects", subjectId);
      await deleteDoc(subjectDoc);
      fetchSubjects();
    } catch (error) {
      console.error("Erro ao deletar matéria:", error);
    }
  };

  return (
    <div className="min-h-screen bg-lightGray p-6">
      <h2 className="text-3xl font-bold text-center">Matérias</h2>

      <div className="mt-8 flex flex-col items-center space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="relative w-full max-w-md p-4 bg-white shadow-md rounded flex justify-between items-center">
            <Link
              to={`/cargo/${cargoId}/materia/${subject.id}`}
              className="text-lg font-semibold text-pureBlack"
            >
              {subject.subject}
            </Link>
            {userRole === "admin" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSubject(subject)}
                  className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingSubject && (
        <div className="flex justify-center mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit();
            }}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Editar Matéria</h3>
            <input
              type="text"
              value={editSubjectTitle}
              onChange={(e) => setEditSubjectTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {userRole === "admin" && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white p-3 rounded"
          >
            {showForm ? "Cancelar" : "Adicionar Nova Matéria"}
          </button>
        </div>
      )}

      {showForm && (
        <div className="flex justify-center mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSubject();
            }}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Nova Matéria</h3>
            <input
              type="text"
              value={newSubjectTitle}
              onChange={(e) => setNewSubjectTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Adicionar
            </button>
          </form>
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

export default CargoPage;
