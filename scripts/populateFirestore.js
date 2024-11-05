// scripts/populateEditalFirestore.js
import { db } from "../src/firebaseConfig.js";
import { collection, setDoc, doc } from "firebase/firestore";

// Estrutura dos dados do edital
const data = {
  analistaJudiciario: {
    title: "Analista Judiciário - Área: Apoio Especializado - Especialidade: Análise de Sistemas de Informação",
    subjects: [
      {
        subject: "Governança e Gestão de TI",
        topics: [
          {
            title: "Planejamento Estratégico de TI (PETI)",
            questions: [
              { front: "O que é o PETI?", verso: "Planejamento estratégico de TI que alinha TI às metas organizacionais." }
            ]
          },
          {
            title: "Plano Diretor de Tecnologia da Informação (PDTIC)",
            questions: [
              { front: "Para que serve o PDTIC?", verso: "Define diretrizes e planos de ações para a TI." }
            ]
          },
          {
            title: "Alinhamento estratégico entre TI e Negócio",
            questions: [
              { front: "Por que alinhar TI ao negócio?", verso: "Para que TI suporte diretamente as metas estratégicas da organização." }
            ]
          }
          // Adicione mais tópicos e perguntas conforme necessário...
        ]
      },
      {
        subject: "Engenharia de Software",
        topics: [
          {
            title: "Análise de Requisitos",
            questions: [
              { front: "O que é análise de requisitos?", verso: "Processo de identificar as necessidades e documentá-las." }
            ]
          },
          {
            title: "Qualidade de Software",
            questions: [
              { front: "Como garantir qualidade de software?", verso: "Através de testes e práticas de manutenção contínua." }
            ]
          }
          // Adicione mais tópicos e perguntas conforme necessário...
        ]
      }
      // Adicione mais matérias conforme necessário...
    ]
  },

  tecnicoJudiciario: {
    title: "Técnico Judiciário - Área: Apoio Especializado - Especialidade: Desenvolvimento de Sistemas de Informação",
    subjects: [
      {
        subject: "Desenvolvimento de Sistemas",
        topics: [
          {
            title: "Desenvolvimento Web",
            questions: [
              { front: "O que é HTML5?", verso: "Linguagem de marcação para estruturação de conteúdo na web." }
            ]
          },
          {
            title: "Arquitetura SOA",
            questions: [
              { front: "O que é SOA?", verso: "Arquitetura orientada a serviços." }
            ]
          }
          // Adicione mais tópicos e perguntas conforme necessário...
        ]
      },
      {
        subject: "Segurança da Informação",
        topics: [
          {
            title: "Métodos de Autenticação",
            questions: [
              { front: "O que é autenticação de dois fatores?", verso: "Método que utiliza duas formas de verificação." }
            ]
          },
          {
            title: "OWASP Top 10",
            questions: [
              { front: "O que é OWASP Top 10?", verso: "Lista dos 10 maiores riscos de segurança em aplicações." }
            ]
          }
          // Adicione mais tópicos e perguntas conforme necessário...
        ]
      }
      // Adicione mais matérias conforme necessário...
    ]
  }
};

// Função para popular o Firestore
const populateFirestore = async () => {
  try {
    for (const [cargoId, cargoData] of Object.entries(data)) {
      const cargoDocRef = doc(db, "cargos", cargoId);
      await setDoc(cargoDocRef, { title: cargoData.title });

      for (const subject of cargoData.subjects) {
        const subjectDocRef = doc(collection(cargoDocRef, "subjects"));
        await setDoc(subjectDocRef, { subject: subject.subject });

        for (const topic of subject.topics) {
          const topicDocRef = doc(collection(subjectDocRef, "topics"));
          await setDoc(topicDocRef, { title: topic.title });

          for (const question of topic.questions) {
            const questionDocRef = doc(collection(topicDocRef, "questions"));
            await setDoc(questionDocRef, { front: question.front, verso: question.verso });
          }
        }
      }
    }
    console.log("Dados do edital adicionados com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar dados do edital:", error);
  }
};

// Executar a função para popular o Firestore
populateFirestore();
