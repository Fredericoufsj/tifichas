// scripts/populateTecnico.js
import { db } from "../src/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

// Dados do cargo
const tecnicoData = {
  title: "Técnico Judiciário - Desenvolvimento de Sistemas de Informação",
  subjects: [
    {
      subject: "Desenvolvimento de Sistemas",
      topics: [
        "Desenvolvimento de sistemas",
        "Desenvolvimento web",
        "JavaScript, HTML5, CSS3, WebSocket, Single Page Application (SPA)",
        "Frameworks: AngularJS, DHTML, AJAX, Vue JS",
        "Noções de desenvolvimento para dispositivos móveis",
        "Arquitetura SOA (Service Oriented Architecture)",
        "Arquitetura cliente-servidor",
        "Ferramentas e frameworks de desenvolvimento Microsoft .Net",
      ],
    },
    {
      subject: "Testes",
      topics: [
        "Conceitos básicos e aplicações",
        "Testes ágeis",
        "Teste de usabilidade de software",
        "Testes automatizados, tipos de testes",
        "Test-driven development (TDD)",
        "Gestão do ciclo de vida de testes",
        "Desenvolvimento de sistemas web",
        "HTML5, CSS3, AJAX",
      ],
    },
    {
      subject: "DevOps e Configuração de Software",
      topics: [
        "DevOps (conhecimento intermediário)",
        "Gestão da configuração de software",
        "Ferramenta de gestão da configuração: GIT",
        "Gestão e modelagem de processos de negócio usando BPMN",
        "Alta disponibilidade de sistemas",
        "Microsoft Power Platform",
        "Power Apps",
        "Power BI",
        "Power Automate",
        "Power Virtual Agents",
      ],
    },
    {
      subject: "Bancos de Dados",
      topics: [
        "Conceitos e fundamentos",
        "Projeto e modelagem de banco de dados relacional",
        "Modelo e Diagrama Entidade Relacionamento",
        "Notação Crow's Foot",
        "Normalização",
        "SGBDs: Oracle, PostgreSQL, SQL Server, MySQL",
        "Linguagem SQL e PL/SQL",
        "Business Intelligence",
        "Data Warehouse, Data Mart, ODS, Data Mining, Data Lake, ETL e OLAP",
        "Modelagem Dimensional de Dados",
      ],
    },
    {
      subject: "Segurança da Informação",
      topics: [
        "Gestão de segurança da informação: NBR ISO/IEC 27001 e 27002",
        "Métodos de autenticação",
        "Autenticação de dois fatores (2FA)",
        "Autenticação por biometria, token e certificados",
        "Protocolos de autenticação: OAuth 2.0, OpenID Connect, JWT",
        "Ameaças e vulnerabilidades em aplicações",
        "SQL Injection, LDAP Injection, Cross-site scripting (XSS)",
        "Quebra de autenticação e gerenciamento de sessão",
        "Referência insegura a objetos",
        "Cross-site request forgery",
        "Armazenamento inseguro de dados criptografados",
        "Segurança de aplicativos web",
        "Análise de vulnerabilidades",
        "OWASP e técnicas de proteção",
        "Prevenção e combate a ataques",
        "DDoS, DoS, DNS spoofing, eavesdropping, phishing, brute force, port scanning",
        "Criptografia e proteção de dados em trânsito e repouso",
        "Sistemas criptográficos (simétricos e assimétricos) e principais protocolos",
        "Assinatura e certificação digital",
        "Gestão de riscos e continuidade de negócio (NBR ISO/IEC 27005)",
        "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD)",
      ],
    },
    {
      subject: "Arquitetura de Software",
      topics: [
        "Usabilidade e acessibilidade na Internet, padrões W3C",
        "Análise estática de código-fonte (clean code e ferramenta SonarQube)",
        "Arquitetura de software",
        "Interoperabilidade de sistemas",
        "Arquitetura orientada a serviços (SOA)",
        "Web services",
        "Arquitetura orientada a objetos",
        "Arquitetura em camadas, modelo MVC",
        "Arquitetura de aplicações para ambiente web",
        "Servidor de aplicações, servidor web",
        "Ambientes Internet, extranet, intranet e portal",
        "Finalidades, características físicas e lógicas, aplicações e serviços",
        "Padrões XML, XSLT, UDDI, WSDL, SOAP, REST e JSON",
      ],
    },
    {
      subject: "Engenharia de Software",
      topics: [
        "Levantamento de requisitos funcionais e não funcionais",
        "Análise de sistemas",
        "Qualidade de software",
        "Unified Modeling Language (UML)",
        "Metodologias ágeis",
        "Scrum, XP, Lean",
        "Métrica de análise de ponto de função",
        "Técnicas e ferramentas de desenvolvimento codeless e nocode",
      ],
    },
  ],
};

// Função para adicionar o cargo, matérias e tópicos
async function addTecnicoData() {
  try {
    const cargoRef = await addDoc(collection(db, "cargos"), {
      title: tecnicoData.title,
    });

    for (const subject of tecnicoData.subjects) {
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

    console.log("Dados de Técnico Judiciário adicionados com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar dados de Técnico Judiciário:", error);
  }
}

// Executa a função
addTecnicoData();
