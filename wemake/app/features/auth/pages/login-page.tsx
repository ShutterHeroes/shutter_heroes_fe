import { Button } from "~/common/components/ui/button";
import { Form, Link, type MetaFunction } from "react-router";
import InputPair from "~/common/components/input-pair";
import AuthButtons from "../components/auth-buttons";

export const meta: MetaFunction = () => {
  return [{ title: "로그인 | 셔터 히어로즈" }];
};

export default function LoginPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant={"ghost"} asChild className="absolute right-8 top-8 ">
        <Link to="/auth/join">가입</Link>
      </Button>
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold font-brush">계정에 로그인하세요</h1>
        <Form className="w-full space-y-4">
          <InputPair
            label="이메일"
            description="이메일 주소를 입력하세요"
            name="email"
            id="email"
            required
            type="email"
            placeholder="예: shutterheroes@example.com"
          />
          <InputPair
            id="password"
            label="비밀번호"
            description="비밀번호를 입력하세요"
            name="password"
            required
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
          <Button className="w-full" type="submit">
            로그인
          </Button>
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}