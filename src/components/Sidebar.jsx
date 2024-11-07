import { Link } from "react-router-dom";
import { FaBook, FaRedo, FaClipboardList, FaLightbulb, FaUser } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`min-h-screen bg-gray-100 flex flex-col items-start py-4 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      } lg:fixed`}
      onMouseEnter={() => window.innerWidth >= 1024 && setIsExpanded(true)}
      onMouseLeave={() => window.innerWidth >= 1024 && setIsExpanded(false)}
    >
      <Link to="/" className="sidebar-item my-4 px-4 flex items-center">
        <FaBook size={24} />
        <span
          className={`ml-4 text-gray-700 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 lg:block hidden`}
        >
          Estudos
        </span>
      </Link>
      <Link to="/revisao" className="sidebar-item my-4 px-4 flex items-center">
        <FaRedo size={24} />
        <span
          className={`ml-4 text-gray-700 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 lg:block hidden`}
        >
          Revisão
        </span>
      </Link>
      <Link to="/simulado" className="sidebar-item my-4 px-4 flex items-center">
        <FaClipboardList size={24} />
        <span
          className={`ml-4 text-gray-700 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 lg:block hidden`}
        >
          Simulado
        </span>
      </Link>
      <Link to="/tecnicas" className="sidebar-item my-4 px-4 flex items-center">
        <FaLightbulb size={24} />
        <span
          className={`ml-4 text-gray-700 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 lg:block hidden`}
        >
          Técnicas
        </span>
      </Link>
      <Link to="/perfil" className="sidebar-item my-4 px-4 flex items-center">
        <FaUser size={24} />
        <span
          className={`ml-4 text-gray-700 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 lg:block hidden`}
        >
          Perfil
        </span>
      </Link>
    </div>
  );
};

export default Sidebar;
