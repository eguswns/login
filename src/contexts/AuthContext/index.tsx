import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";

type UserProfile = {
  email: string;
  name: string;
  age: string;
  uid: string;
  createdAt?: Date;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  error: string;
  signup: (
    email: string,
    password: string,
    name: string,
    age: string
  ) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, age: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용해야 합니다.");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError("");

      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const profile = userSnap.data() as Omit<UserProfile, "uid">;
            setUser({
              ...profile,
              uid: firebaseUser.uid,
            });
          }
        } catch (err) {
          console.error("프로필 로드 실패:", err);
          setError("프로필 로드 실패");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string, age: string) => {
      setError("");
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const firebaseUser = userCredential.user;

        await setDoc(doc(db, "users", firebaseUser.uid), {
          email,
          name,
          age,
          createdAt: serverTimestamp(),
        });

        await updateProfile(firebaseUser, { displayName: name });
      } catch (err: any) {
        setError(err.message || "회원가입 실패");
        throw err;
      }
    },
    []
  );

  const signin = useCallback(async (email: string, password: string) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      if (err.code === "auth/recent-password-leak") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        return;
      }

      let message = "로그인 실패";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        message = "이메일 또는 비밀번호가 틀렸습니다.";
      } else if (err.code === "auth/invalid-email") {
        message = "올바르지 않은 이메일 형식입니다.";
      } else if (err.code === "auth/too-many-requests") {
        message = "너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.";
      }
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  }, []);

  const updateProfileFn = useCallback(
    async (name: string, age: string) => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { name, age: Number(age) });

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: name });
        }

        setUser((prev) => (prev ? { ...prev, name, age } : null));
      } catch (err) {
        setError("프로필 수정 실패");
        throw err;
      }
    },
    [user?.uid]
  );

  const updatePasswordFn = useCallback(async (newPassword: string) => {
    if (!auth.currentUser) return;

    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (err: any) {
      setError("비밀번호 변경 실패");
      throw err;
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      error,
      signup,
      signin,
      logout,
      updateProfile: updateProfileFn,
      updatePassword: updatePasswordFn,
    }),
    [
      user,
      loading,
      error,
      signup,
      signin,
      logout,
      updateProfileFn,
      updatePasswordFn,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
