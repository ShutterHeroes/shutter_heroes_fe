import { Button } from "~/common/components/ui/button";
import { Form, Link, type MetaFunction } from "react-router";
import InputPair from "~/common/components/input-pair";
import AuthButtons from "../components/auth-buttons";

export const meta: MetaFunction = () => {
  return [{ title: "가입 | 셔터 히어로즈" }];
};

export default function JoinPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant={"ghost"} asChild className="absolute right-8 top-8 ">
        <Link to="/auth/login">로그인</Link>
      </Button>
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold font-brush">계정 만들기</h1>
        <Form className="w-full space-y-4">
          <InputPair
            label="이름"
            description="이름을 입력하세요"
            name="name"
            id="name"
            required
            type="text"
            placeholder="이름을 입력하세요"
          />
          <InputPair
            id="username"
            label="사용자명"
            description="사용자명을 입력하세요"
            name="username"
            required
            type="text"
            placeholder="예: shutterheroes"
          />
          <InputPair
            id="email"
            label="이메일"
            description="이메일 주소를 입력하세요"
            name="email"
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
            계정 만들기
          </Button>
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}