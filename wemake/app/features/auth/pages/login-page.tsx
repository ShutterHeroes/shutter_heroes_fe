import { Button } from "~/common/components/ui/button";
import { Link, type MetaFunction } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schema";
import { useLogin } from "../hooks/use-login";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";

export const meta: MetaFunction = () => {
  return [{ title: "로그인 | 셔터 히어로즈" }];
};

export default function LoginPage() {
  // const { login, isLoading, error } = useLogin();
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  // });

  // const onSubmit = async (data: LoginFormData) => {
  //   await login(data);
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10 p-8">
        <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          셔터 히어로즈
        </Link>

        {/* {error && (
          <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )} */}

        {/* <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="shutterheroes@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form> */}

        {/* 소셜 로그인 구분선 */}
        {/* <div className="w-full flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">또는</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div> */}

        {/* 카카오 로그인 */}
        <a
          href={`${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`}
          className="w-full"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-black border-0 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.548 4.58 3.878 5.953-.155.563-.993 3.572-1.139 4.106-.173.632.232.623.487.453.192-.128 3.077-2.058 4.106-2.753.556.097 1.134.147 1.722.147 5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
            </svg>
            카카오 로그인
          </Button>
        </a>

        {/* <p className="text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link to="/auth/join" className="text-blue-600 hover:underline">
            가입하기
          </Link>
        </p> */}
      </div>
    </div>
  );
}
