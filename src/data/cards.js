// src/data/cards.js
export const cards = {
  analistaJudiciario: {
    title: "Analista Judiciário - Área: Apoio Especializado - Especialidade: Análise de Sistemas de Informação",
    subjects: [
      {
        subject: "Governança e Gestão de TI",
        topics: [
          {
            title: "Planejamento Estratégico de TI (PETI)",
            questions: [
              { front: "O que é PETI?", verso: "Planejamento estratégico de TI é o processo de alinhar TI com as metas organizacionais." },
              { front: "Qual a importância do PETI?", verso: "O PETI ajuda a garantir que os recursos de TI sejam usados estrategicamente para suportar os objetivos do negócio." },
            ]
          },
          {
            title: "COBIT 2019",
            questions: [
              { front: "O que é COBIT?", verso: "COBIT é um framework de governança e gestão de TI." },
              { front: "Quais são os objetivos do COBIT?", verso: "Ajudar as organizações a alcançar metas de governança de TI." },
            ]
          }
        ]
      },
      {
        subject: "Engenharia de Software",
        topics: [
          {
            title: "Análise de Requisitos",
            questions: [
              { front: "O que é análise de requisitos?", verso: "É o processo de identificar as necessidades dos usuários e documentá-las." },
              { front: "Tipos de requisitos?", verso: "Requisitos funcionais e não-funcionais." },
            ]
          },
          {
            title: "Qualidade de Software",
            questions: [
              { front: "O que é qualidade de software?", verso: "A capacidade de um software atender aos requisitos e satisfazer o cliente." },
              { front: "Modelo CMMI-DEV v. 2.0", verso: "Modelo de maturidade para desenvolvimento de software." },
            ]
          }
        ]
      }
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
              { front: "O que é HTML5?", verso: "Linguagem de marcação para estruturação de conteúdo na web." },
              { front: "O que é CSS3?", verso: "Linguagem de estilo para personalização de aparência." },
            ]
          },
          {
            title: "Arquitetura SOA",
            questions: [
              { front: "O que é SOA?", verso: "Arquitetura orientada a serviços." },
              { front: "Componentes de SOA", verso: "Serviços, contratos, componentes e repositório." },
            ]
          }
        ]
      }
    ]
  }
};
