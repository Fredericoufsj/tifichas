import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const ReviewPage = () => {
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    const cargosCollection = collection(db, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);

    const cargosList = cargosSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || "Cargo sem título",
      totalQuestions: doc.data().totalQuestions || 0,
      pendingQuestions: doc.data().pendingQuestions || 0, // Agora pega direto o total de pendências
    }));

    setCargos(cargosList);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Revisão Inteligente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cargos.map((cargo) => (
          <Link
            key={cargo.id}
            to={`/revisao/cargo/${cargo.id}`}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center"
          >
            <h3 className="font-semibold">{cargo.title}</h3>
            <p>{cargo.totalQuestions} questões no total</p>
            {cargo.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                {cargo.pendingQuestions}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
