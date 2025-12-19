// routes/RootRoutes.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import MyPage from "../../pages/MyPage";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  return user ? children : <Navigate to="/signin" />;
};

const RootRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default RootRoutes;
