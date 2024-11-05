// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <button onClick={() => navigate(-1)} className="text-lg font-semibold hover:text-gray-300">
        ← Voltar
      </button>
      <Link to="/" className="text-2xl font-bold">
        Portal de Estudos
      </Link>
      <button onClick={() => navigate(1)} className="text-lg font-semibold hover:text-gray-300">
        Avançar →
      </button>
    </nav>
  );
};

export default Navbar;
