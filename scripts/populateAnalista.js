// scripts/populateAnalista.js
import { db } from "../src/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

// Dados do cargo
const analistaData = {
  title: "Analista Judiciário - Área: Apoio Especializado - Especialidade: Análise de Sistemas de Informação",
  subjects: [
    {
      subject: "Governança e Gestão de TI",
      topics: [
        "Planejamento estratégico da TI - PETI",
        "Plano Diretor de Tecnologia da Informação - PDTIC",
        "Alinhamento estratégico entre TI e negócio",
        "Estrutura organizacional e responsabilidades de TI",
        "ISO/IEC 38500",
        "ISO/IEC 20000",
        "COBIT 2019",
        "ITIL v4",
        "PMBOK 7ª Edição",
        "Processos ágeis",
        "Scrum",
        "Kanban",
        "Modelagem e mapeamento de processos de negócio",
        "Conceitos sobre processos de negócio",
        "Identificação e delimitação de processos de negócio",
        "Construção e mensuração de indicadores de processos de negócio",
        "Técnicas de mapeamento, modelagem e melhoria de processos de negócio",
        "Modelagem de processos em BPMN",
      ],
    },
    {
      subject: "Normativos da PDPJ-BR",
      topics: [
        "Resolução CNJ nº 522/2023",
        "Resolução CNJ nº 335/2020",
        "Portaria CNJ nº 252/2020",
        "Portaria CNJ nº 253/2020",
        "Portaria CNJ nº 131/2021",
        "Resolução CNJ nº 396/2021",
        "Portaria CNJ nº 162/2021",
        "Resolução CNJ nº 468/2022",
      ],
    },
    {
      subject: "Arquitetura de Desenvolvimento da PDPJ-BR",
      topics: [
        "Linguagem de programação Java",
        "Arquitetura distribuída de microsserviços; API RESTful; JSON; Spring (Cloud, Boot, Eureka, Zuul)",
        "Persistência: JPA 2.0, Hibernate 4.3+, Flyway",
        "Banco de dados: PostgreSQL, H2 Database",
        "Serviços de autenticação (SSO, Keycloak, OAuth2)",
        "Mensageria e webhooks: RabbitMQ, eventos, APIs reversas",
        "Ferramenta de versionamento: Git",
        "Ambiente de clusters: Kubernetes, Rancher",
        "Deploy de aplicações: CI/CD",
      ],
    },
    {
      subject: "Noções Gerais sobre DevOps",
      topics: [
        "Princípios e fundamentos das práticas DevOps",
        "CI/CD (continuous integration/continuous delivery)",
        "Kubernetes, Rancher",
      ],
    },
    {
      subject: "Processos de Negócios",
      topics: [
        "Conceitos básicos sobre processos de negócio",
        "Identificação e delimitação de processos de negócio",
        "Construção e mensuração de indicadores de processos de negócio",
        "Técnicas de mapeamento, modelagem e melhoria de processos de negócio",
        "Modelagem de processos em UML 2.5 e BPMN",
        "Automação de processos de negócio (BPM)",
      ],
    },
    {
      subject: "Engenharia de Software",
      topics: [
        "Conceitos básicos sobre engenharia de software",
        "Disciplinas de engenharia de software",
        "Análise de requisitos funcionais e não-funcionais",
        "Análise e projeto",
        "Qualidade de software",
        "CMMI-DEV v. 2.0",
        "ABNT NBR ISO/IEC/IEEE 12207:2021",
        "MR-MPS-SW",
        "Análise de pontos de função (IFPUG e NESMA)",
      ],
    },
    {
      subject: "Arquitetura de Software",
      topics: [
        "Arquitetura de aplicações para ambiente web",
        "Arquitetura em camadas",
        "Arquitetura de microsserviços",
        "API RESTful",
        "JSON",
        "Spring (Cloud, Boot, Eureka, Zuul)",
        "Map Struct, Swagger, Service Discovery, API Gateway",
        "Domain-Driven Design",
        "Design Patterns",
      ],
    },
    {
      subject: "Desenvolvimento de Software",
      topics: [
        "Lógica de programação",
        "Programação estruturada e orientada a objetos",
        "Criptografia (básico, protocolos, algoritmos)",
        "Métricas de qualidade de código",
        "Clean code e refactoring",
        "Testes automatizados e TDD (JUnit, Jasmine, Karma, Sonarqube, Mocks)",
        "Bancos de dados (modelagem, normalização, SQL, Oracle19c, PL/pgSQL)",
        "Persistência (JPA 2.0, Hibernate, Flyway)",
        "Mensageria e webhooks (RabbitMQ, eventos, APIs reversas)",
        "JSON",
      ],
    },
    {
      subject: "Programação Web",
      topics: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Angular",
        "XML",
        "TypeScript",
        "Acessibilidade (WCAG, eMAG)",
        "Servidores de aplicação (WildFly, Apache, Tomcat)",
        "Git e Github",
      ],
    },
    {
      subject: "Ciência de Dados",
      topics: [
        "Big data e analytics",
        "Business intelligence 3.0",
        "Data warehouse",
        "ETL, data mining, data mart, OLAP",
      ],
    },
    {
      subject: "Inteligência Artificial e Aprendizado de Máquina",
      topics: [
        "Técnicas de pré-processamento de dados",
        "Modelos preditivos e descritivos",
        "Avaliação de modelos (ajuste, métricas, ROC)",
        "Grandes modelos de linguagem (LLM), IA generativa",
        "Redes neurais",
        "Governança e ética na IA (transparência, responsabilidade, etc.)",
      ],
    },
    {
      subject: "Desenvolvimento de Software Seguro",
      topics: [
        "SDL, CLASP, codificação segura e programação defensiva",
        "OWASP Top 10",
        "NIST secure software development framework",
      ],
    },
  ],
};

// Função para adicionar o cargo, matérias e tópicos
async function addAnalistaData() {
  try {
    const cargoRef = await addDoc(collection(db, "cargos"), {
      title: analistaData.title,
    });

    for (const subject of analistaData.subjects) {
      const subjectRef = await addDoc(
        collection(db, "cargos", cargoRef.id, "subjects"),
        { subject: subject.subject }
      );

      for (const topic of subject.topics) {
        await addDoc(
          collection(db, "cargos", cargoRef.id, "subjects", subjectRef.id, "topics"),
          { title: topic }
        );
      }
    }

    console.log("Dados de Analista Judiciário adicionados com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar dados de Analista Judiciário:", error);
  }
}

// Executa a função
addAnalistaData();
