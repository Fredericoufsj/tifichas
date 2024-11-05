// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import { FaBook, FaRedo, FaClipboardList, FaLightbulb, FaUser } from "react-icons/fa";

const Sidebar = () => (
  <div className="sidebar min-h-screen w-20 bg-gray-100 flex flex-col items-center py-4">
    <Link to="/" className="my-4">
      <FaBook size={24} />
    </Link>
    <Link to="/revisao" className="my-4">
      <FaRedo size={24} />
    </Link>
    <Link to="/simulado" className="my-4">
      <FaClipboardList size={24} />
    </Link>
    <Link to="/tecnicas" className="my-4">
      <FaLightbulb size={24} />
    </Link>
    <Link to="/perfil" className="my-4">
      <FaUser size={24} />
    </Link>
  </div>
);

export default Sidebar;
