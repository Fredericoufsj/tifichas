// src/pages/CargoPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const CargoPage = () => {
  const { cargoId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, [cargoId]);

  const fetchSubjects = async () => {
    const subjectsCollection = collection(db, "cargos", cargoId, "subjects");
    const subjectsSnapshot = await getDocs(subjectsCollection);
    const subjectsList = subjectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSubjects(subjectsList);
  };

  return (
    <div className="min-h-screen bg-lightGray p-6">
      <h2 className="text-3xl font-bold text-center">Matérias</h2>
      <div className="mt-8 flex flex-col items-center space-y-4">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/cargo/${cargoId}/materia/${subject.id}`}
            className="w-full max-w-md bg-white text-pureBlack text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 text-center"
          >
            {subject.subject}
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white p-3 rounded">
          Voltar
        </button>
      </div>
    </div>
  );
};

export default CargoPage;
