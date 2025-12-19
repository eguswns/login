import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import React from "react";

type FormData = {
  email: string;
  password: string;
};

const SignIn = React.memo(() => {
  const navigate = useNavigate();
  const { signin, user, loading: authLoading } = useAuth();
  const [localError, setLocalError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      navigate("/mypage");
    }
  }, [user, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      setLocalError("");
      await signin(data.email, data.password);
      reset();
    } catch (error) {
      setLocalError("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-[570px] flex flex-col justify-center rounded-[16px]"
      >
        <h2 className="text-[24px] text-center font-semibold mt-[45px] mb-[40px]">
          Welcome!
        </h2>

        <div className="flex justify-center">
          {localError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-[16px] w-[460px]">
              <p className="text-[14px] font-medium text-red-700">
                {localError}
              </p>
            </div>
          )}
        </div>

        <div className="mb-[16px] flex flex-col items-center justify-center">
          <Input
            type="email"
            placeholder="Email"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다",
              },
            })}
            disabled={authLoading}
          />
          <div className="mt-1">
            {errors.email && (
              <p className="text-[12px] text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="mb-[24px] flex flex-col items-center justify-center">
          <Input
            type="password"
            placeholder="Password"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 6,
                message: "비밀번호는 6자 이상이어야 합니다",
              },
            })}
            disabled={authLoading}
          />
          <div className="mt-1">
            {errors.password && (
              <p className="text-[12px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center mb-[40px]">
          <Button
            type="submit"
            disabled={authLoading}
            className="w-[460px] h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {authLoading ? "로그인 중..." : "Sign in"}
          </Button>
        </div>

        <div className="flex gap-[10px] justify-center items-center mb-[52px]">
          <p className="text-[#999] text-[17px]">Need an account?</p>
          <Button
            type="button"
            onClick={() => navigate("/signup")}
            disabled={authLoading}
            className="font-semibold text-[17px] hover:underline disabled:opacity-50"
          >
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
});

export default SignIn;
