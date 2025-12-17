import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";

type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("회원가입 성공:", userCredential.user);
      navigate("/signin");
    } catch (error: any) {
      console.error("회원가입 실패:", error.code, error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-[570px] h-[410px] flex flex-col justify-center rounded-[16px]"
      >
        <h2 className="text-[24px] text-center font-semibold mb-[40px]">
          Sign Up
        </h2>

        <div className="mb-[10px] flex items-center justify-center">
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
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-[10px] flex items-center justify-center">
          <Input
            type="password"
            placeholder="Password"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: { value: 6, message: "6자 이상 입력해주세요" },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-[20px] flex items-center justify-center">
          <Input
            type="password"
            placeholder="Confirm Password"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center mb-[40px]">
          <Button
            type="submit"
            className="w-[460px] h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold"
          >
            Sign up
          </Button>
        </div>
        <div className="flex gap-[10px] justify-center items-center">
          <p className="text-[#999] text-[17px]">Have an account?</p>
          <Button
            type="button"
            onClick={() => navigate("/signin")}
            className="font-semibold text-[17px]"
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
