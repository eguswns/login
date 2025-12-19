import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button";
import Input from "../../components/Input";

type PasswordForm = { newPassword: string };

const MyPage = React.memo(() => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateProfile,
    updatePassword,
    loading: authLoading,
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [localError, setLocalError] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");

  const passwordForm = useForm<PasswordForm>();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditAge(user.age);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setLocalError("");
      await updateProfile(editName, editAge);
      setIsEditing(false);
    } catch (error) {
      setLocalError("프로필 수정에 실패했습니다.");
    }
  };

  const handlePasswordReset = async (data: PasswordForm) => {
    try {
      await updatePassword(data.newPassword);
      setShowPasswordReset(false);
      passwordForm.reset();
      setLocalError("비밀번호가 변경되었습니다!");
    } catch (error) {
      setLocalError("비밀번호 변경에 실패했습니다.");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
        <p className="text-[17px]">로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
        <div className="bg-white w-[570px] flex flex-col justify-center rounded-[16px]">
          <h1 className="text-[24px] text-center font-semibold mb-[40px] mt-[45px]">
            My Page
          </h1>

          {localError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-[16px] w-[460px] mx-auto flex justify-center">
              <p className="text-[14px] font-medium text-red-700">
                {localError}
              </p>
            </div>
          )}

          {!isEditing ? (
            <>
              <div className="flex items-center justify-center mb-[30px]">
                <p className="w-[460px] border border-[#ccc] rounded-[24px] py-[15px] pr-[10px] pl-[30px] font-semibold text-center text-[17px] leading-relaxed">
                  안녕하세요! <br />
                  <span className="text-red-500">{user.name}</span>님 <br />(
                  {user.age}세)
                </p>
              </div>

              <div className="mb-[15px] w-[460px] flex items-center gap-2 mx-auto">
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={authLoading}
                  className="flex-1 h-[47px] border border-[#333] rounded-[24px] text-black font-semibold disabled:opacity-50"
                >
                  프로필 수정
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  disabled={authLoading}
                  className="flex-1 h-[47px] bg-gray-400 rounded-[24px] text-white font-semibold disabled:opacity-50"
                >
                  비밀번호 변경
                </Button>
              </div>

              <div className="flex items-center justify-center mb-[52px]">
                <Button
                  onClick={logout}
                  disabled={authLoading}
                  className="w-[460px] h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold disabled:opacity-50"
                >
                  로그아웃
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-[10px] flex flex-col items-center justify-center">
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
                />
              </div>
              <div className="mb-[25px] flex flex-col items-center justify-center">
                <Input
                  type="text"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  placeholder="나이를 입력하세요"
                  className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
                />
              </div>
              <div className="mb-[52px] w-[460px] flex items-center gap-2 mx-auto">
                <Button
                  onClick={handleSaveProfile}
                  disabled={authLoading}
                  className="flex-1 h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold disabled:opacity-50"
                >
                  {authLoading ? "저장 중..." : "저장"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={authLoading}
                  className="flex-1 h-[47px] bg-white border border-black rounded-[24px] text-black font-semibold disabled:opacity-50"
                >
                  취소
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-[16px]">
            <h3 className="text-xl font-bold mb-6 text-center">
              비밀번호 변경
            </h3>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordReset)}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="새 비밀번호 (6자 이상)"
                className="w-full h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
                {...passwordForm.register("newPassword", {
                  required: "새 비밀번호를 입력해주세요",
                  minLength: { value: 6, message: "6자 이상 입력해주세요" },
                })}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-[12px] text-red-500 ml-8">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting || authLoading}
                  className="flex-1 h-[47px] bg-[#31313d] text-white font-semibold rounded-[24px] disabled:opacity-50"
                >
                  {passwordForm.formState.isSubmitting ? "변경 중..." : "변경"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPasswordReset(false)}
                  disabled={authLoading}
                  className="flex-1 h-[47px] bg-gray-400 text-white font-semibold rounded-[24px] disabled:opacity-50"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

export default MyPage;
