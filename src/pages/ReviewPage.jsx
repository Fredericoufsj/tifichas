import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ReviewPage = () => {
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    // Caminho ajustado para acessar `users/{userId}/cargos`
    const cargosCollection = collection(db, "users", user.uid, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);

    const today = new Date();
    const cargosList = await Promise.all(
      cargosSnapshot.docs.map(async (doc) => {
        const cargoData = doc.data();
        const subjectsCollection = collection(db, "users", user.uid, "cargos", doc.id, "subjects");
        const subjectsSnapshot = await getDocs(subjectsCollection);

        let totalQuestions = 0;
        let pendingQuestions = 0;

        // Calcular total de questões e questões pendentes
        for (const subjectDoc of subjectsSnapshot.docs) {
          const topicsCollection = collection(
            db,
            "users",
            user.uid,
            "cargos",
            doc.id,
            "subjects",
            subjectDoc.id,
            "topics"
          );
          const topicsSnapshot = await getDocs(topicsCollection);

          for (const topicDoc of topicsSnapshot.docs) {
            const topicData = topicDoc.data();
            const questionsCollection = collection(
              db,
              "users",
              user.uid,
              "cargos",
              doc.id,
              "subjects",
              subjectDoc.id,
              "topics",
              topicDoc.id,
              "questions"
            );
            const questionsSnapshot = await getDocs(questionsCollection);

            // Filtragem para calcular questões pendentes
            const pendingQuestionsCount = questionsSnapshot.docs.filter((questionDoc) => {
              const nextReviewDate = questionDoc.data().nextReview ? questionDoc.data().nextReview.toDate() : null;
              return !nextReviewDate || nextReviewDate <= today;
            }).length;

            totalQuestions += topicData.totalQuestions || questionsSnapshot.docs.length;
            pendingQuestions += pendingQuestionsCount;
          }
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
    <div className="p-6 ml-20 md:ml-0">
      <h2 className="text-2xl font-bold mb-6 text-center">Revisão Inteligente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {cargos.map((cargo) => (
          <Link
            key={cargo.id}
            to={`/revisao/cargo/${cargo.id}`}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col w-full max-w-xs items-center"
          >
            <h3 className="font-semibold text-lg text-center mb-2">{cargo.title}</h3>
            <p className="text-gray-600 text-sm">{cargo.totalQuestions} questões no total</p>
            {cargo.pendingQuestions > 0 && (
              <span className="bg-red-500 text-white rounded-full px-3 py-1 mt-2 text-xs font-bold">
                {cargo.pendingQuestions} pendentes
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
