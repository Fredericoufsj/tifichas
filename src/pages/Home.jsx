// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import CargoModal from "../components/CargoModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
  const examDate = new Date("2025-01-19T00:00:00");
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [cargos, setCargos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    fetchCargos();

    return () => clearInterval(timer);
  }, []);

  const fetchCargos = async () => {
    const cargosCollection = collection(db, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);
    const cargosList = cargosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCargos(cargosList);
  };

  const handleAdd = async (data) => {
    await addDoc(collection(db, "cargos"), data);
    setModalOpen(false);
    fetchCargos();
  };

  const handleUpdate = async (data) => {
    const cargoDoc = doc(db, "cargos", editingCargo.id);
    await updateDoc(cargoDoc, data);
    setModalOpen(false);
    setEditingCargo(null);
    fetchCargos();
  };

  const handleDelete = async (cargoId) => {
    const cargoDoc = doc(db, "cargos", cargoId);
    await deleteDoc(cargoDoc);
    fetchCargos();
  };

  const openAddModal = () => {
    setEditingCargo(null);
    setModalOpen(true);
  };

  const openEditModal = (cargo) => {
    setEditingCargo(cargo);
    setModalOpen(true);
  };

  function calculateTimeLeft() {
    const now = new Date();
    const difference = examDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-lightGray flex flex-col items-center p-6 text-pureBlack font-body">
      <h1 className="text-4xl font-header font-bold mt-10 mb-4">Bem-vindo ao Portal de Estudos</h1>
      <p className="text-xl italic mb-10 text-darkGray">"O sucesso é a soma de pequenos esforços repetidos dia após dia."</p>

      {timeLeft ? (
        <div className="text-center bg-mediumGray text-pureBlack rounded-lg p-4 mb-10 shadow-lg">
          <h2 className="text-2xl font-semibold">Tempo até a prova:</h2>
          <p className="text-lg mt-2">
            {timeLeft.days} dias, {timeLeft.hours} horas, {timeLeft.minutes} minutos, {timeLeft.seconds} segundos
          </p>
        </div>
      ) : (
        <div className="text-center bg-darkGray text-pureWhite rounded-lg p-4 mb-10 shadow-lg">
          <h2 className="text-2xl font-semibold">A prova já começou! Boa sorte!</h2>
        </div>
      )}

      <div className="flex flex-col space-y-4 items-center w-full max-w-md">
        {cargos.map((cargo) => (
          <div key={cargo.id} className="relative w-full bg-pureWhite text-pureBlack text-lg font-header font-semibold py-3 rounded-lg shadow-md flex justify-between items-center">
            <Link to={`/cargo/${cargo.id}`} className="flex-1 text-center">
              {cargo.title}
            </Link>
            <div className="flex space-x-2 pr-4">
              <button onClick={() => openEditModal(cargo)} className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(cargo.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button onClick={openAddModal} className="bg-blue-500 text-white p-3 rounded">Adicionar Novo Cargo</button>
      </div>

      <CargoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editingCargo ? handleUpdate : handleAdd}
        initialData={editingCargo}
      />
    </div>
  );
};

export default Home;
