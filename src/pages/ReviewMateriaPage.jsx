import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ReviewMateriaPage = () => {
  const { cargoId } = useParams();
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchMaterias();
  }, [cargoId]);

  const fetchMaterias = async () => {
    const materiasCollection = collection(db, "cargos", cargoId, "subjects");
    const materiasSnapshot = await getDocs(materiasCollection);

    const materiasList = materiasSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(`Materia ID: ${doc.id}, totalQuestions: ${data.totalQuestions}`); // Log para cada matéria
      return {
        id: doc.id,
        subject: data.subject || "Matéria sem título",
        totalQuestions: data.totalQuestions || 0, // Verifica e mostra o valor carregado
      };
    });

    setMaterias(materiasList);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matérias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materias.map((materia) => (
          <Link
            key={materia.id}
            to={`/revisao/cargo/${cargoId}/materia/${materia.id}`}
            className="bg-white p-4 rounded shadow-md"
          >
            <h3 className="font-semibold">{materia.subject}</h3>
            <p>{materia.totalQuestions} questões no total</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewMateriaPage;
