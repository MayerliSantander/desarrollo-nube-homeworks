import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  type User,
  signOut,
  linkWithCredential,
  linkWithPopup,
  PhoneAuthProvider,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth, firebaseDb } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { doc, setDoc } from "firebase/firestore";

export const useFirebaseUser = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (user) {
      return;
    }
    onAuthStateChanged(firebaseAuth, (loggedInUser) => {
      setUserLoading(false);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    });
  }, [user]);
  const loginWithFirebase = (email: string, password: string) => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
      });
  };
  const registerWithFirebase = async (
    email: string,
    password: string,
    fullName: string,
    address: string,
    birthDate: string
  ) => {
    try{
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      
      const calculateAge = (birthDate: string): number => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };

      const age = calculateAge(birthDate);
      
      await setDoc(doc(firebaseDb, "users", user.uid), {
        fullName,
        email,
        address,
        birthDate,
        age,
        createdAt: new Date()
      });

      await updateProfile(user, {
        displayName: fullName,
      });

      console.log("Usuario registrado y perfil creado");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al registrar usuario:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);

        console.log("User signed in with Google:", result.user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Error signing in with Google:", {
          errorCode,
          errorMessage,
          email,
          credential,
        });
      });
  };

  const loginWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        FacebookAuthProvider.credentialFromResult(result);
        
        console.log("User signed in with Facebook:", result.user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error("Error signing in with Facebook:", {
          errorCode,
          errorMessage,
          email,
          credential,
        });
      });
  };

  const logout = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("User signed out successfully");
        setUser(null);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  const linkWithPassword = (email: string, password: string) => {
    if (!user) {
      return;
    }
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(user, credential)
      .then((usercred) => {
        const user = usercred.user;
        console.log("Account linking success", user);
      })
      .catch((error) => {
        console.log("Account linking error", error);
      });
  };

  const linkWithFacebook = () => {
    if (!user) return;
    const provider = new FacebookAuthProvider();
    linkWithPopup(user, provider)
      .then((result) => {
        console.log("Facebook linked:", result.user);
      })
      .catch((error) => {
        console.error("Error linking Facebook:", error);
      });
  };

  const linkWithPhone = async (
    verificationId: string,
    verificationCode: string
  ) => {
    if (!user) {
      return false;
    }
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    const userCred = await linkWithCredential(user, credential);
    if (!userCred) {
      console.error("Failed to link with phone");
      return false;
    }
    console.log("Account linking success", user);
    return true;
  };

  return {
    user,
    userLoading,
    loginWithFirebase,
    registerWithFirebase,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    linkWithPassword,
    linkWithFacebook,
    linkWithPhone,
  };
};
