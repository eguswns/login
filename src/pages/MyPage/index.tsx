import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { auth } from "../../../firebase";

const MyPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
      <div className="bg-white w-[570px] h-[410px] flex flex-col justify-center rounded-[16px]">
        <h1 className="text-[24px] text-center font-semibold mb-[40px]">
          My Page
        </h1>

        {userEmail ? (
          <>
            <div className="flex items-center justify-center mb-[40px]">
              <p className="w-[460px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px] font-semibold text-center text-[17px]">
                안녕하세요! <br />
                <span className="text-red-500">{userEmail}</span>님
              </p>
            </div>
            <div className="flex items-center justify-center mb-[10px]">
              <Button
                onClick={handleLogout}
                className="w-[460px] h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold"
              >
                로그아웃
              </Button>
            </div>
          </>
        ) : (
          <p className="text-[17px]">로딩 중...</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;
