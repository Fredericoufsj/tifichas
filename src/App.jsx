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
  const [loading, setLoading] = useState(true); // Adicione um estado de loading
  const auth = getAuth();

  useEffect(() => {
    // Verifica o estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Atualiza o estado do usuário
      setLoading(false); // Define loading como false após a verificação
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Carregando...</div>; // Exibe uma mensagem enquanto verifica a autenticação
  }

  return (
    <div className="flex">
      {user ? (
        <>
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
              <Route path="*" element={<Navigate to="/" />} /> {/* Redireciona rotas desconhecidas para a página principal */}
            </Routes>
          </div>
        </>
      ) : (
        <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redireciona rotas desconhecidas para a página de login */}
        </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
