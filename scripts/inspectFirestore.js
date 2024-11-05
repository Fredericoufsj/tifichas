import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDvDl2uezImBuCiqhZdjafhj3tFKLavG-M",
    authDomain: "flashcards-projeto.firebaseapp.com",
    projectId: "flashcards-projeto",
    storageBucket: "flashcards-projeto.firebasestorage.app",
    messagingSenderId: "485348311072",
    appId: "1:485348311072:web:c102ddb5a71af62416bc45"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para inspecionar a coleção e seus documentos
async function inspectCollection(collectionPath) {
    try {
      const colRef = collection(db, collectionPath);
      const colSnapshot = await getDocs(colRef);
      console.log(`Coleção: ${collectionPath}`);
      
      for (const doc of colSnapshot.docs) {
        console.log(`  Documento ID: ${doc.id}`);
        const docData = doc.data();
        console.log("  Campos:");
        
        for (const [field, value] of Object.entries(docData)) {
          console.log(`    - ${field}: ${typeof value}`);
        }
  
        // Recursively inspect subcollections
        const subcollections = await getDocs(collection(db, collectionPath, doc.id, "subjects"));
        if (!subcollections.empty) {
          console.log(`  Subcoleção: subjects`);
          for (const subdoc of subcollections.docs) {
            console.log(`    Documento ID: ${subdoc.id}`);
            const subdocData = subdoc.data();
            console.log("    Campos:");
            for (const [field, value] of Object.entries(subdocData)) {
              console.log(`      - ${field}: ${typeof value}`);
            }
  
            // Check for nested subcollections under 'topics'
            const topics = await getDocs(collection(db, collectionPath, doc.id, "subjects", subdoc.id, "topics"));
            if (!topics.empty) {
              console.log(`    Subcoleção: topics`);
              for (const topicDoc of topics.docs) {
                console.log(`      Documento ID: ${topicDoc.id}`);
                const topicData = topicDoc.data();
                console.log("      Campos:");
                for (const [field, value] of Object.entries(topicData)) {
                  console.log(`        - ${field}: ${typeof value}`);
                }
              }
            }
          }
        }
      }
      console.log("Estrutura do Firestore exibida com sucesso.");
    } catch (error) {
      console.error("Erro ao inspecionar Firestore:", error);
    }
  }
  
  // Chame a função para a coleção raiz 'cargos'
  inspectCollection("cargos");