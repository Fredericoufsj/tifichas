import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../src/firebaseConfig.js";

const initializePendingQuestionsField = async () => {
  try {
    const cargosCollection = collection(db, "cargos");
    const cargosSnapshot = await getDocs(cargosCollection);

    for (const cargoDoc of cargosSnapshot.docs) {
      const cargoId = cargoDoc.id;
      const subjectsCollection = collection(db, "cargos", cargoId, "subjects");
      const subjectsSnapshot = await getDocs(subjectsCollection);

      let totalPendingQuestionsInCargo = 0; // Contador para o cargo

      for (const subjectDoc of subjectsSnapshot.docs) {
        const materiaId = subjectDoc.id;
        const topicsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics");
        const topicsSnapshot = await getDocs(topicsCollection);

        let totalPendingQuestionsInMateria = 0; // Contador para a matéria

        for (const topicDoc of topicsSnapshot.docs) {
          const topicoId = topicDoc.id;
          const questionsCollection = collection(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId, "questions");
          const questionsSnapshot = await getDocs(questionsCollection);

          const today = new Date();
          const pendingQuestionsCount = questionsSnapshot.docs.filter((questionDoc) => {
            const nextReviewDate = questionDoc.data().nextReview ? questionDoc.data().nextReview.toDate() : null;
            return !nextReviewDate || nextReviewDate <= today;
          }).length;

          totalPendingQuestionsInMateria += pendingQuestionsCount;

          // Atualiza o campo `pendingQuestions` no tópico
          const topicRef = doc(db, "cargos", cargoId, "subjects", materiaId, "topics", topicoId);
          await updateDoc(topicRef, {
            pendingQuestions: pendingQuestionsCount,
          });

          console.log(`Tópico atualizado: ${topicoId} com ${pendingQuestionsCount} questões pendentes`);
        }

        totalPendingQuestionsInCargo += totalPendingQuestionsInMateria;

        // Atualiza o campo `pendingQuestions` na matéria com o total dos tópicos
        const subjectRef = doc(db, "cargos", cargoId, "subjects", materiaId);
        await updateDoc(subjectRef, {
          pendingQuestions: totalPendingQuestionsInMateria,
        });

        console.log(`Matéria atualizada: ${materiaId} com ${totalPendingQuestionsInMateria} questões pendentes`);
      }

      // Atualiza o campo `pendingQuestions` no cargo com o total das matérias
      const cargoRef = doc(db, "cargos", cargoId);
      await updateDoc(cargoRef, {
        pendingQuestions: totalPendingQuestionsInCargo,
      });

      console.log(`Cargo atualizado: ${cargoId} com ${totalPendingQuestionsInCargo} questões pendentes`);
    }

    console.log("Inicialização de pendingQuestions concluída com sucesso para todos os níveis!");
  } catch (error) {
    console.error("Erro ao inicializar o campo pendingQuestions:", error);
  }
};

// Chame a função para inicializar `pendingQuestions`
initializePendingQuestionsField();
