import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const FlashCard = ({ title, description, onEdit, onDelete }) => {
  const [flipped, setFlipped] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <motion.div
      className="w-64 h-40 m-4 cursor-pointer relative"
      onClick={handleFlip}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative w-full h-full rounded-lg shadow-lg"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Frente do card */}
        <div className="absolute w-full h-full flex flex-col justify-center items-center bg-slate-200 text-pureBlack rounded-lg p-4" style={{ backfaceVisibility: "hidden" }}>
          <h2 className="text-lg font-bold text-center">{title}</h2>

          {userRole === "admin" && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white">
                <FaEdit />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white">
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Verso do card */}
        <div className="absolute w-full h-full flex flex-col justify-center items-center bg-slate-400 text-white rounded-lg p-4" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <h2 className="text-lg font-semibold text-center">Resposta</h2>
          <p className="text-sm text-center">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlashCard;
