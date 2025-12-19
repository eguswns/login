import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";
import React, { useState } from "react";

type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age: string;
};

const SignUp = React.memo(() => {
  const navigate = useNavigate();
  const { signup, loading: authLoading } = useAuth();
  const [localError, setLocalError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>();

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLocalError("");
      await signup(data.email, data.password, data.name, data.age);
      reset();
      navigate("/mypage");
    } catch (error) {
      setLocalError("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-[570px] flex flex-col justify-center rounded-[16px]"
      >
        <h2 className="text-[24px] text-center font-semibold mb-[40px] mt-[40px]">
          Sign Up
        </h2>

        {localError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-[16px] w-[460px] mx-auto flex justify-center">
            <p className="text-[14px] font-medium text-red-700">{localError}</p>
          </div>
        )}

        <div className="mb-[10px] flex flex-col items-center justify-center">
          <Input
            type="text"
            placeholder="Name"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            disabled={authLoading}
            {...register("name", {
              required: "이름을 입력해주세요",
              minLength: { value: 2, message: "이름은 2자 이상 입력해주세요" },
              pattern: {
                value: /^[가-힣a-zA-Z]+$/,
                message: "한글 또는 영문만 입력해주세요",
              },
            })}
          />
          <div className="mt-1">
            {errors.name && (
              <p className="text-[12px] text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="mb-[10px] flex flex-col items-center justify-center">
          <Input
            type="text"
            placeholder="Age"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            disabled={authLoading}
            {...register("age", {
              required: "나이를 입력해주세요",
              pattern: {
                value: /^[0-9]+$/,
                message: "숫자만 입력해주세요",
              },
            })}
          />
          <div className="mt-1">
            {errors.age && (
              <p className="text-[12px] text-red-500">{errors.age.message}</p>
            )}
          </div>
        </div>

        <div className="mb-[10px] flex flex-col items-center justify-center">
          <Input
            type="email"
            placeholder="Email"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            disabled={authLoading}
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다",
              },
            })}
          />
          <div className="mt-1">
            {errors.email && (
              <p className="text-[12px] text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="mb-[10px] flex flex-col items-center justify-center">
          <Input
            type="password"
            placeholder="Password"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            disabled={authLoading}
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: { value: 6, message: "6자 이상 입력해주세요" },
            })}
          />
          <div className="mt-1">
            {errors.password && (
              <p className="text-[12px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-[20px] flex flex-col items-center justify-center">
          <Input
            type="password"
            placeholder="Confirm Password"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            disabled={authLoading}
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다",
            })}
          />
          <div className="mt-1">
            {errors.confirmPassword && (
              <p className="text-[12px] text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center mb-[40px]">
          <Button
            type="submit"
            disabled={authLoading}
            className="w-[460px] h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? "가입 중..." : "Sign up"}
          </Button>
        </div>

        <div className="flex gap-[10px] justify-center items-center mb-[40px]">
          <p className="text-[#999] text-[17px]">Have an account?</p>
          <Button
            type="button"
            onClick={() => navigate("/signin")}
            disabled={authLoading}
            className="font-semibold hover:underline text-[17px] disabled:opacity-50"
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
});

export default SignUp;
