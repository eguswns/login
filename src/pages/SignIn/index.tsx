import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("로그인 성공:", userCredential.user);
      navigate("/mypage");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };
  return (
    <div className="min-h-screen bg-[#7c7c7c] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-[570px] h-[410px] flex flex-col justify-center rounded-[16px]"
      >
        <h2 className="text-[24px] text-center font-semibold mb-[40px]">
          Welcome!
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
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="mb-[20px] flex items-center justify-center">
          <Input
            type="password"
            placeholder="Password"
            className="w-[460px] h-[47px] border border-[#ccc] rounded-[24px] py-[10px] pr-[10px] pl-[30px]"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: { value: 6, message: "6자 이상 입력" },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-center mb-[40px]">
          <Button
            type="submit"
            className="w-[460px] h-[47px] bg-[#31313d] rounded-[24px] text-white font-semibold"
          >
            Sing in
          </Button>
        </div>
        <div className="flex gap-[10px] justify-center items-center">
          <p className="text-[#999] text-[17px]">Need an account?</p>
          <Button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-semibold text-[17px]"
          >
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
