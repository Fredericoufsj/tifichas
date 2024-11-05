# Tifichas - Portal de Estudos com Flashcards

Este é um portal de estudos desenvolvido com React, Tailwind CSS e Firebase, criado para facilitar a revisão e o acompanhamento do progresso de estudo com a metodologia de flashcards. Os usuários podem criar cargos, matérias, tópicos e questões, além de revisar os conteúdos com base em um sistema de revisão espaçada.

## Funcionalidades

- **Gerenciamento de Cargos e Matérias**: Adicione, edite e exclua cargos e matérias conforme necessário.
- **Tópicos e Questões Personalizadas**: Criação de tópicos e questões de revisão personalizados para cada matéria.
- **Revisão Inteligente**: Sistema de revisão espaçada para melhor memorização, com intervalos ajustáveis entre revisões.
- **Progresso de Estudo**: Barra de progresso exibida para cada tópico, matéria e cargo, com controle de `totalQuestions` e `completedQuestions` diretamente no Firestore.
- **Interface Amigável**: Navegação simplificada entre cargos, matérias e tópicos com uma interface intuitiva.
- **Adição e Controle de Questões**: Modal de adição de questões com feedback visual e opções para `Não Lembrei`, `Lembrei Parcialmente`, `Lembrei Bem` e `Lembrei Facilmente`.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Firebase Firestore**: Banco de dados NoSQL para armazenamento e sincronização de dados em tempo real.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **React Router**: Gerenciamento de rotas para navegação entre páginas.
- **Framer Motion**: Animações suaves para transições de elementos, incluindo o flip dos cartões.
  
## Estrutura do Banco de Dados Firestore

A estrutura do Firestore está organizada em subcoleções para facilitar o acesso aos dados:
- `cargos`
  - `subjects` (Matérias)
    - `topics` (Tópicos)
      - `questions` (Questões)

Cada tópico contém os campos `totalQuestions` e `completedQuestions` para facilitar o controle de progresso.

## Como Configurar o Projeto

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/seu-usuario/tifichas.git
   cd tifichas

2. **Instalar Dependências**
    npm install
3. **Configurar o Firebase**
    Crie um projeto no Firebase Console.
    Configure o Firestore e copie as configurações para o arquivo src/firebaseConfig.js

         ``` // src/firebaseConfig.js
        import { initializeApp } from "firebase/app";
        import { getFirestore } from "firebase/firestore";

        const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_AUTH_DOMAIN",
        projectId: "SEU_PROJECT_ID",
        storageBucket: "SEU_STORAGE_BUCKET",
        messagingSenderId: "SEU_MESSAGING_SENDER_ID",
        appId: "SEU_APP_ID",
        };

        const app = initializeApp(firebaseConfig);
        export const db = getFirestore(app);

4. **Rodar o Projeto**
      ```  npm run dev

5. **Populate do Firestore**

**Navegação:** A interface principal contém links para os cargos disponíveis. Dentro de cada cargo, é possível navegar para as matérias, tópicos e questões de revisão.
**Revisão:** Cada questão possui botões para avaliar a lembrança do usuário. A data de revisão é ajustada automaticamente, conforme as respostas, para otimizar a revisão espaçada.
**Barra de Progresso:** Exibe o progresso de revisão, com base em totalQuestions e completedQuestions.
**Estrutura de Pastas**
## src
**components** - Componentes reutilizáveis, como FlashCard e Modals.
**pages** - Páginas do app, como Home, CargoPage, ReviewPage.
**firebaseConfig.js** - Configurações do Firebase.
**data** - Scripts para popular o banco de dados.
## Contribuição
- Faça um fork do projeto.
- Crie uma branch para sua feature (git checkout -b feature/nova-feature).
- Commit suas alterações (git commit -m 'Adiciona nova feature').
- Faça um push para a branch (git push origin feature/nova-feature).
- Abra um Pull Request.
## Licença
Este projeto é licenciado sob a licença MIT.

Projeto desenvolvido para otimizar o processo de estudo e memorização com flashcards personalizados e revisões inteligentes. Ideal para preparação para concursos e estudos focados em grandes volumes de conteúdo.


Esse `README` contém informações sobre as funcionalidades, configurações, uso, tecnologias utilizadas e a estrutura do banco de dados.
