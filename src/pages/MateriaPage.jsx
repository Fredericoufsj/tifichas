import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import TopicModal from "../components/TopicModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAuth } from "firebase/auth";

const MateriaPage = () => {
  const { cargoId, materiaId } = useParams();
  const [topics, setTopics] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchTopics();
  }, [cargoId, materiaId]);

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

  const fetchTopics = async () => {
    const topicsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics");
    const topicsSnapshot = await getDocs(topicsCollection);
    const topicsList = topicsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTopics(topicsList);
  };

  const handleAdd = async (data) => {
    await addDoc(collection(db, "cargos", cargoId, "subjects", materiaId, "topics"), data);
    setModalOpen(false);
    fetchTopics();
  };

  const handleUpdate = async (data) => {
    const topicDoc = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", editingTopic.id);
    await updateDoc(topicDoc, data);
    setModalOpen(false);
    setEditingTopic(null);
    fetchTopics();
  };

  const handleDelete = async (topicId) => {
    const topicDoc = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicId);
    await deleteDoc(topicDoc);
    fetchTopics();
  };

  const openAddModal = () => {
    setEditingTopic(null);
    setModalOpen(true);
  };

  const openEditModal = (topic) => {
    setEditingTopic(topic);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-lightGray p-6">
      <h2 className="text-3xl font-bold text-center">Tópicos</h2>
      <div className="mt-8 flex flex-col items-center space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="relative w-full max-w-md p-4 bg-white shadow-md rounded flex justify-between items-center">
            <Link to={`/cargo/${cargoId}/materia/${materiaId}/topico/${topic.id}`} className="text-lg font-semibold text-pureBlack">
              {topic.title}
            </Link>
            {userRole === "admin" && (
              <div className="flex space-x-2">
                <button onClick={() => openEditModal(topic)} className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(topic.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {userRole === "admin" && (<div className="flex justify-center mt-8">
        <button onClick={openAddModal} className="bg-blue-500 text-white p-3 rounded">Adicionar Novo Tópico</button>
      </div>)}

      <div className="flex justify-center mt-4">
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white p-3 rounded">Voltar</button>
      </div>

      <TopicModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editingTopic ? handleUpdate : handleAdd}
        initialData={editingTopic}
      />
    </div>
  );
};

export default MateriaPage;
