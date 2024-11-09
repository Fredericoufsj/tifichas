import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReviewMateriaPage = () => {
  const { cargoId } = useParams();
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchMaterias();
  }, [cargoId]);

  const fetchMaterias = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    try {
      // Acessando as matérias diretamente dentro de `users/{userId}/cargos/{cargoId}/subjects`
      const materiasCollection = collection(db, "users", user.uid, "cargos", cargoId, "subjects");
      const materiasSnapshot = await getDocs(materiasCollection);

      const materiasList = materiasSnapshot.docs.map((doc) => {
        const materiaData = doc.data();

        // Utilizando os campos agregados `totalQuestions` e `pendingQuestions`
        const totalQuestions = materiaData.totalQuestions || 0;
        const pendingQuestions = materiaData.pendingQuestions || 0;

        return {
          id: doc.id,
          subject: materiaData.subject || "Matéria sem título",
          totalQuestions,
          pendingQuestions,
        };
      });

      setMaterias(materiasList);
    } catch (error) {
      console.error("Erro ao buscar matérias:", error);
    }
  };

  return (
    <div className="p-6 ml-20 md:ml-0">
      <h2 className="text-2xl font-bold mb-6 text-center">Matérias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {materias.map((materia) => (
          <Link
            key={materia.id}
            to={`/revisao/cargo/${cargoId}/materia/${materia.id}`}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col w-full max-w-xs items-center"
          >
            <h3 className="font-semibold text-lg text-center mb-2">{materia.subject}</h3>
            <p className="text-gray-600 text-sm">{materia.totalQuestions} questões no total</p>
            {materia.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-3 py-1 mt-2 text-xs font-bold">
                {materia.pendingQuestions} pendentes
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewMateriaPage;
