import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const registerUser = async (email, password, role) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Definir o papel do usuário no Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role, // "admin" ou "viewer"
    });

    console.log("Usuário registrado com sucesso:", user.email);
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
  }
};
