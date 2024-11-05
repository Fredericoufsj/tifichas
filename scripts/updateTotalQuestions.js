// scripts/updateTotalQuestions.js
import { db } from "../src/firebaseConfig.js";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const updateTotalQuestions = async () => {
  try {
    const cargosCollection = collection(db, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);

    for (const cargoDoc of cargosSnapshot.docs) {
      const cargoId = cargoDoc.id;
      let cargoTotalQuestions = 0;
      const subjectsCollection = collection(db, "cargos", cargoId, "subjects");
      const subjectsSnapshot = await getDocs(subjectsCollection);

      for (const subjectDoc of subjectsSnapshot.docs) {
        const subjectId = subjectDoc.id;
        let subjectTotalQuestions = 0;
        const topicsCollection = collection(db, "cargos", cargoId, "subjects", subjectId, "topics");
        const topicsSnapshot = await getDocs(topicsCollection);

        for (const topicDoc of topicsSnapshot.docs) {
          const topicId = topicDoc.id;
          const questionsCollection = collection(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId, "questions");
          const questionsSnapshot = await getDocs(questionsCollection);

          const topicTotalQuestions = questionsSnapshot.size; // Total de questões neste tópico
          cargoTotalQuestions += topicTotalQuestions;
          subjectTotalQuestions += topicTotalQuestions;

          // Atualiza o total de questões no tópico
          await updateDoc(doc(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId), {
            totalQuestions: topicTotalQuestions,
            completedQuestions: 0, // Inicialize como zero
          });

          console.log(`Updated topic ${topicId} with totalQuestions: ${topicTotalQuestions}`);
        }

        // Atualiza o total de questões na matéria
        await updateDoc(doc(db, "cargos", cargoId, "subjects", subjectId), {
          totalQuestions: subjectTotalQuestions,
          completedQuestions: 0,
        });

        console.log(`Updated subject ${subjectId} with totalQuestions: ${subjectTotalQuestions}`);
      }

      // Atualiza o total de questões no cargo
      await updateDoc(doc(db, "cargos", cargoId), {
        totalQuestions: cargoTotalQuestions,
        completedQuestions: 0,
      });

      console.log(`Updated cargo ${cargoId} with totalQuestions: ${cargoTotalQuestions}`);
    }
    console.log("Atualização de totalQuestions concluída.");
  } catch (error) {
    console.error("Erro ao atualizar totalQuestions:", error);
  }
};

updateTotalQuestions();
