import { Button } from "~/common/components/ui/button";
import { Link, type MetaFunction } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schema";
import { useRegister } from "../hooks/use-register";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";

export const meta: MetaFunction = () => {
  return [{ title: "가입 | 셔터 히어로즈" }];
};

export default function JoinPage() {
  const { register: registerUser, isLoading, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10 p-8">
        <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          셔터 히어로즈
        </Link>

        {error && (
          <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일 *</Label>
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
            <Label htmlFor="password">비밀번호 *</Label>
            <Input
              id="password"
              type="password"
              placeholder="최소 8자 이상"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인 *</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              {...register("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <p className="text-sm text-red-600">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">표시 이름 (선택)</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="닉네임을 입력하세요"
              {...register("displayName")}
            />
            {errors.displayName && (
              <p className="text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "처리 중..." : "계정 만들기"}
          </Button>
        </form>

        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
