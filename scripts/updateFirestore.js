// scripts/updateFirestore.js
import { db } from "../src/firebaseConfig.js"; // Certifique-se de que o caminho está correto
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";

const updateQuestionsWithNextReview = async () => {
  try {
    // Coleções para atualizar (adapte para os seus IDs de cargos e matérias)
    const cargosCollection = collection(db, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);

    for (const cargoDoc of cargosSnapshot.docs) {
      const cargoId = cargoDoc.id;
      const subjectsCollection = collection(db, "cargos", cargoId, "subjects");
      const subjectsSnapshot = await getDocs(subjectsCollection);

      for (const subjectDoc of subjectsSnapshot.docs) {
        const subjectId = subjectDoc.id;
        const topicsCollection = collection(db, "cargos", cargoId, "subjects", subjectId, "topics");
        const topicsSnapshot = await getDocs(topicsCollection);

        for (const topicDoc of topicsSnapshot.docs) {
          const topicId = topicDoc.id;
          const questionsCollection = collection(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId, "questions");
          const questionsSnapshot = await getDocs(questionsCollection);

          for (const questionDoc of questionsSnapshot.docs) {
            const questionId = questionDoc.id;
            const questionRef = doc(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId, "questions", questionId);

            // Adicionar o campo `nextReview` com a data atual
            await updateDoc(questionRef, {
              nextReview: Timestamp.fromDate(new Date())
            });

            console.log(`Updated question ${questionId} with nextReview`);
          }
        }
      }
    }
    console.log("Todas as questões foram atualizadas com o campo `nextReview`.");
  } catch (error) {
    console.error("Erro ao atualizar questões:", error);
  }
};

updateQuestionsWithNextReview();
