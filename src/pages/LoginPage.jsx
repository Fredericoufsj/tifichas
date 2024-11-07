// src/pages/LoginPage.jsx
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica se o documento do usuário existe no Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Cria um novo documento para o usuário com permissão "viewer"
        await setDoc(userDocRef, {
          email: user.email,
          role: "viewer", // Define o papel padrão como "viewer"
        });
      }

      navigate("/"); // Redireciona para a página inicial após o login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Bem-vindo ao Portal de Estudos</h1>
        <p className="text-gray-600 mb-8">Entre com sua conta Google para continuar</p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out"
        >
          <FaGoogle className="mr-2" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
