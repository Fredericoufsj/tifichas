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
  
    const cargosList = await Promise.all(
      cargosSnapshot.docs.map(async (doc) => {
        const cargoData = doc.data();
        const subjectsCollection = collection(db, "cargos", doc.id, "subjects");
        const subjectsSnapshot = await getDocs(subjectsCollection);
  
        let totalQuestions = 0;
        let pendingQuestions = 0;
  
        for (const subjectDoc of subjectsSnapshot.docs) {
          const subjectData = subjectDoc.data();
          const topicsCollection = collection(db, "cargos", doc.id, "subjects", subjectDoc.id, "topics");
          const topicsSnapshot = await getDocs(topicsCollection);
  
          topicsSnapshot.docs.forEach((topicDoc) => {
            const topicData = topicDoc.data();
            totalQuestions += topicData.totalQuestions || 0;
            pendingQuestions += topicData.pendingQuestions || 0;
          });
        }
  
        return {
          id: doc.id,
          title: cargoData.title || "Cargo sem título",
          totalQuestions,
          pendingQuestions,
        };
      })
    );
  
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
