import { Route, Routes } from "react-router-dom";
import SignUp from "../../pages/SignUp";
import SignIn from "../../pages/SignIn";
import MyPage from "../../pages/MyPage";

const RootRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="mypage" element={<MyPage />} />
      <Route path="*" element={<>404 NOT FOUND</>} />
    </Routes>
  );
};

export default RootRoutes;
