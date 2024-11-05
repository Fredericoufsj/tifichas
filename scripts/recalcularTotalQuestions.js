// scripts/recalcularTotalQuestions.js

// Importações do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyDvDl2uezImBuCiqhZdjafhj3tFKLavG-M",
  authDomain: "flashcards-projeto.firebaseapp.com",
  projectId: "flashcards-projeto",
  storageBucket: "flashcards-projeto.firebasestorage.app",
  messagingSenderId: "485348311072",
  appId: "1:485348311072:web:c102ddb5a71af62416bc45"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recalcularTotalQuestions = async () => {
  const cargosCollection = collection(db, "cargos");
  const cargosSnapshot = await getDocs(cargosCollection);

  // Iterar sobre cada cargo
  for (const cargoDoc of cargosSnapshot.docs) {
    const cargoId = cargoDoc.id;
    const subjectsCollection = collection(db, "cargos", cargoId, "subjects");
    const subjectsSnapshot = await getDocs(subjectsCollection);

    // Iterar sobre cada matéria
    for (const subjectDoc of subjectsSnapshot.docs) {
      const subjectId = subjectDoc.id;
      const topicsCollection = collection(db, "cargos", cargoId, "subjects", subjectId, "topics");
      const topicsSnapshot = await getDocs(topicsCollection);

      let subjectTotalQuestions = 0;

      // Iterar sobre cada tópico
      for (const topicDoc of topicsSnapshot.docs) {
        const topicId = topicDoc.id;
        const questionsCollection = collection(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId, "questions");
        const questionsSnapshot = await getDocs(questionsCollection);

        const totalQuestions = questionsSnapshot.size;
        subjectTotalQuestions += totalQuestions;

        // Atualizar o totalQuestions do tópico
        const topicRef = doc(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId);
        await updateDoc(topicRef, {
          totalQuestions: totalQuestions,
        });
        console.log(`Tópico ${topicId} atualizado com totalQuestions = ${totalQuestions}`);
      }

      // Atualizar o totalQuestions da matéria com a soma de todos os tópicos
      const subjectRef = doc(db, "cargos", cargoId, "subjects", subjectId);
      await updateDoc(subjectRef, {
        totalQuestions: subjectTotalQuestions,
      });
      console.log(`Matéria ${subjectId} atualizada com totalQuestions = ${subjectTotalQuestions}`);
    }
  }

  console.log("Recalculated totalQuestions for all topics and subjects.");
};

// Executa o script
recalcularTotalQuestions()
  .then(() => {
    console.log("Script finalizado.");
    process.exit(0); // Encerra o processo quando finalizado
  })
  .catch((error) => {
    console.error("Erro ao executar o script:", error);
    process.exit(1); // Encerra o processo com erro
  });
