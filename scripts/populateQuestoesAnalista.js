// scripts/populateQuestoesAnalista.js
import { db } from "../src/firebaseConfig.js";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Importando arquivos de perguntas
import PlanejamentoEstrategicoTI from "./questions/PlanejamentoEstrategicoTI.js";
import PlanoDiretorTI from "./questions/PlanoDiretorTI.js";
import AlinhamentoEstrategicoTI from "./questions/AlinhamentoEstrategicoTI.js";
import EstruturaOrganizacionalTI from "./questions/EstruturaOrganizacionalTI.js";
import ISO38500 from "./questions/ISO38500.js";
import ISO20000 from "./questions/ISO20000.js";

// Mapeamento entre tópicos e arquivos de perguntas
const questionMap = {
  "Planejamento estratégico da TI - PETI": PlanejamentoEstrategicoTI,
  "Plano Diretor de Tecnologia da Informação - PDTIC": PlanoDiretorTI,
  "Alinhamento estratégico entre TI e negócio": AlinhamentoEstrategicoTI,
  "Estrutura organizacional e responsabilidades de TI": EstruturaOrganizacionalTI,
  "ISO/IEC 38500": ISO38500,
  "ISO/IEC 20000": ISO20000,
  // Adicione outros tópicos e arquivos de perguntas conforme necessário
};

// Função para adicionar perguntas específicas a cada tópico
async function addQuestionsToTopics(cargoId) {
  try {
    const subjectsSnapshot = await getDocs(collection(db, "cargos", cargoId, "subjects"));
    
    for (const subjectDoc of subjectsSnapshot.docs) {
      const subjectId = subjectDoc.id;
      const topicsSnapshot = await getDocs(collection(db, "cargos", cargoId, "subjects", subjectId, "topics"));

      for (const topicDoc of topicsSnapshot.docs) {
        const topicTitle = topicDoc.data().title;
        const topicId = topicDoc.id;

        // Verifica se o tópico possui perguntas mapeadas
        if (questionMap[topicTitle]) {
          console.log(`Adicionando questões para o tópico: ${topicTitle}`);
          
          for (const question of questionMap[topicTitle]) {
            await addDoc(
              collection(db, "cargos", cargoId, "subjects", subjectId, "topics", topicId, "questions"),
              question
            );
          }
        } else {
          console.log(`Nenhuma questão definida para o tópico: ${topicTitle}`);
        }
      }
    }

    console.log("Questões adicionadas com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar questões:", error);
  }
}

// Função principal para iniciar o processo
async function populateQuestionsForAnalista() {
  const cargosSnapshot = await getDocs(collection(db, "cargos"));
  
  const analistaCargo = cargosSnapshot.docs.find(doc => doc.data().title.includes("Analista Judiciário"));
  if (analistaCargo) {
    await addQuestionsToTopics(analistaCargo.id);
  } else {
    console.log("Cargo 'Analista Judiciário' não encontrado.");
  }
}

// Executa a função principal
populateQuestionsForAnalista();
