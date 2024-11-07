import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import CargoModal from "../components/CargoModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
  const [cargos, setCargos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    fetchCargos();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateTimers();
    }, 1000);

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar o componente
  }, [cargos]);

  const fetchCargos = async () => {
    const cargosCollection = collection(db, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);
    const cargosList = cargosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      examDate: doc.data().examDate ? doc.data().examDate.toDate() : null,
    }));
    setCargos(cargosList);
    updateTimers(cargosList); // Atualiza o tempo restante imediatamente ao carregar os cargos
  };

  const updateTimers = (cargosList = cargos) => {
    const now = new Date();
    const newTimeLeft = {};

    cargosList.forEach((cargo) => {
      if (cargo.examDate) {
        const difference = cargo.examDate - now;
        if (difference > 0) {
          newTimeLeft[cargo.id] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        } else {
          newTimeLeft[cargo.id] = null; // Prova iniciada
        }
      }
    });

    setTimeLeft(newTimeLeft);
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

  return (
    <div className="min-h-screen bg-lightGray flex flex-col items-center p-6 text-pureBlack font-body">
      <h1 className="text-4xl font-header font-bold mt-10 mb-4">Bem-vindo ao Portal de Estudos</h1>
      <p className="text-xl italic mb-10 text-darkGray">"O sucesso é a soma de pequenos esforços repetidos dia após dia."</p>

      <div className="flex flex-col space-y-4 items-center w-full max-w-md">
        {cargos.map((cargo) => (
          <div key={cargo.id} className="relative w-full bg-pureWhite text-pureBlack text-lg font-header font-semibold py-4 px-6 rounded-lg shadow-md flex flex-col">
            <Link to={`/cargo/${cargo.id}`} className="block text-left">
              <h3 className="font-semibold">{cargo.title}</h3>
            </Link>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-right">
                {timeLeft[cargo.id] ? (
                  <>
                    <p className="font-medium text-gray-600">Tempo até a prova:</p>
                    <p>{timeLeft[cargo.id].days}d {timeLeft[cargo.id].hours}h {timeLeft[cargo.id].minutes}m {timeLeft[cargo.id].seconds}s</p>
                  </>
                ) : (
                  <p className="text-sm text-red-500 font-medium">Prova Iniciada</p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button onClick={() => openEditModal(cargo)} className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(cargo.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
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
