import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import client, { AT } from "../api/client";
import Input from "../components/Input";
import Button from "../components/Button";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // 폼 기본동작(새로고침) 막기(필수)
    if (loading) return; // 중복 제출 방지
    setError("");
    setLoading(true);

    try {
      const res = await client.post("/api/auth/login", { username, password });

      const token = res.headers["authorization"];
      if (!token) throw new Error("토큰 없음");

      sessionStorage.setItem(AT, token); // AT토큰 sessionStorage저장
      navigate("/foodmaterials"); // 성공 후 이동(로그인 뒤에 보여질 페이지 권한에 따라 다름)
    } catch {
      setError("아이디 또는 비밀번호를 확인해주세요");
    } finally {
      setLoading(false); //성공이든 실패든 무조건 로딩 끄기
    }
  };

  return (
    <>
      <div className="login-wrap">
        <form className="login-box" onSubmit={handleSubmit}>
          <h1 className="main-title">로그인</h1>

          <div className="section-title">아이디</div>
          <Input
            text=""
            inputType="text"
            value={username}
            onChange={setUsername}
            placeholder="아이디를 입력하세요"
          />

          <div className="form-group">
            <div className="section-title">비밀번호</div>
            <Input
              text=""
              inputType="password"
              value={password}
              onChange={setPassword}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <Button type="submit" className="submitbutton">
            {loading ? "로그인 중..." : "로그인"}
          </Button>

          <div className="auth-links">
            <Link to="/register">회원가입</Link> |{" "}
            <Link to="/pwupdate">비밀번호 찾기</Link>
          </div>

          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </>
  );
}

export default LoginPage;
