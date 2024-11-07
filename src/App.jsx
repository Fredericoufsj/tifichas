// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import CargoPage from "./pages/CargoPage";
import MateriaPage from "./pages/MateriaPage";
import TopicPage from "./pages/TopicPage";
import Sidebar from "./components/Sidebar";
import ReviewPage from "./pages/ReviewPage";
import QuestionReviewPage from "./pages/QuestionReviewPage";
import ReviewMateriaPage from "./pages/ReviewMateriaPage";
import ReviewTopicPage from "./pages/ReviewTopicPage";
import ReviewQuestionPage from "./pages/ReviewQuestionPage";
import LoginPage from "./pages/LoginPage"; // Novo componente de login

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Verifica o estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Atualiza o estado do usuário
    });

    return () => unsubscribe();
  }, [auth]);

  if (!user) {
    // Renderiza a página de login em tela cheia se o usuário não está autenticado
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cargo/:cargoId" element={<CargoPage />} />
          <Route path="/cargo/:cargoId/materia/:materiaId" element={<MateriaPage />} />
          <Route path="/cargo/:cargoId/materia/:materiaId/topico/:topicoId" element={<TopicPage />} />
          <Route path="/revisao" element={<ReviewPage />} />
          <Route path="/revisao/:questionId" element={<QuestionReviewPage />} />
          <Route path="/revisao/cargo/:cargoId" element={<ReviewMateriaPage />} />
          <Route path="/revisao/cargo/:cargoId/materia/:materiaId" element={<ReviewTopicPage />} />
          <Route path="/revisao/cargo/:cargoId/materia/:materiaId/topico/:topicoId" element={<ReviewQuestionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

