// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import CargoModal from "../components/CargoModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
  const [cargos, setCargos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchUserRole(); // Busca o papel do usuário logado
    fetchCargos();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("Usuário não autenticado. Redirecionando para a página de login.");
      navigate("/login");
    } else {
      console.log("Usuário autenticado:", user.uid);
    }
  }, []);
  
  

  useEffect(() => {
    const timer = setInterval(() => {
      updateTimers();
    }, 1000);

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar o componente
  }, [cargos]);

  const fetchUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }
  
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      } else {
        console.error("Documento do usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar papel do usuário:", error);
    }
  };
  
  const fetchCargos = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("Usuário autenticado:", user.uid);
console.log("Buscando cargos em:", `users/${user.uid}/cargos`);

  
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }
  
    try {
      // Caminho correto para buscar "cargos" dentro de "users/{userId}"
      const cargosCollection = collection(db, "users", user.uid, "cargos");
      const cargosSnapshot = await getDocs(cargosCollection);
  
      if (cargosSnapshot.empty) {
        console.log("Nenhum cargo encontrado para o usuário.");
        setCargos([]);
        return;
      }
  
      const cargosList = cargosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        examDate: doc.data().examDate ? doc.data().examDate.toDate() : null,
      }));
  
      setCargos(cargosList);
      updateTimers(cargosList);
    } catch (error) {
      console.error("Erro ao buscar cargos:", error);
    }
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
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }
  
    try {
      await addDoc(collection(db, "users", user.uid, "cargos"), {
        ...data,
        examDate: data.examDate,
      });
      setModalOpen(false);
      fetchCargos();
    } catch (error) {
      console.error("Erro ao adicionar cargo:", error);
    }
  };
  

  const handleUpdate = async (data) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }
  
    try {
      const cargoDoc = doc(db, "users", user.uid, "cargos", editingCargo.id);
      await updateDoc(cargoDoc, {
        ...data,
        examDate: data.examDate,
      });
      setModalOpen(false);
      setEditingCargo(null);
      fetchCargos();
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error);
    }
  };
  

  const handleDelete = async (cargoId) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }
  
    try {
      const cargoDoc = doc(db, "users", user.uid, "cargos", cargoId);
      await deleteDoc(cargoDoc);
      fetchCargos();
    } catch (error) {
      console.error("Erro ao deletar cargo:", error);
    }
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
              
              {/* Condicional para exibir os ícones apenas para admins */}
              {userRole === "admin" && (
                <div className="flex space-x-2 ml-4">
                  <button onClick={() => openEditModal(cargo)} className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(cargo.id)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
            {/* Condicional para exibir os ícones apenas para admins */}
            {userRole === "admin" && (
      <div className="flex justify-center mt-8">
        <button onClick={openAddModal} className="bg-blue-500 text-white p-3 rounded">Adicionar Novo Cargo</button>
      </div>
              )}
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
