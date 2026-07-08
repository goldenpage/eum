import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Input from "../components/Input";
//import type { PwUpdateRequest } from "../types/dto/PwUpdateDto";
import "./css/PwUpdatePage.css";

// 비밀번호 규칙 : 영문 숫자 특수문자 혼합 4~8자
const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,8}$/;

function PwUpdatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [bId, setBId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [resultFlag, setResultFlag] = useState(false);

  const openNext = () => setStep((s) => s + 1);

  const submitIdentity = () => {
    if (!bId || !name) {
      setMessage("아이디와 이름을 입력해주세요");
      return;
    }
    setMessage("");
    openNext();
  };

  const sendPhoneCode = async () => {
    if (!phone) {
      setMessage("휴대폰 번호를 입력해주세요.");
      return;
    }
    //const res = await client.post("/api/auth/경로설정", { phone });
    setMessage("인증번호를 발송했습니다.");
  };

  const verifyPhoneCode = async () => {
    if (!phoneCode) {
      setMessage("인증번호를 입력해주세요.");
      return;
    }
    //const res = await client.post("/api/auth/경로설정", { phoneCode });
    setPhoneVerified(true);
    setMessage("휴대폰 인증이 완료되었습니다 다음을 눌러주세요.");
  };

  const verifyPhoneCodeNext = async () => {
    if (phoneVerified == true) {
      setMessage("");
      openNext();
    }
  };

  const submitPwUpdate = async () => {
    if (!phoneVerified) {
      setMessage("휴대폰 인증을 완료 해주세요.");
      return;
    }
    if (!PW_REGEX.test(pw)) {
      setMessage("비밀번호는 영문, 숫자, 특수문자 혼합 4~8자 입니다.");
      return;
    }
    if (pw != pwConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    //const req : PwUpdateRequest = {bId, name, pw, phone, phoneVerified};
    //await client.post("/api/auth/경로설정", req);
    setResultFlag(true);
    setMessage("비밀번호가 변경되었습니다.");
  };

  const backbtn = async () => {
    setMessage("");

    if (step === 1) {
      navigate("/login");
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="change-wrap">
      <div className="change-box">
        <h1 className="main-title">비밀번호 변경</h1>
        <Button type="button" className="backbtn" onClick={backbtn}>
          ←
        </Button>
        {step === 1 && (
          <div className="form-group step-appear">
            <p className="description">
              안전한 계정 사용을 위해
              <br />
              새로운 비밀번호를 설정해 주세요.
            </p>
            <div className="section-title">아이디</div>
            <Input
              text=""
              inputType="text"
              placeholder="아이디를 입력해주세요."
              value={bId}
              onChange={setBId}
            />
            <div className="section-title">이름</div>
            <Input
              text=""
              inputType="text"
              placeholder="이름을 입력해주세요."
              value={name}
              onChange={setName}
            />
            <Button
              type="button"
              className="submitbutton"
              onClick={submitIdentity}
            >
              다음
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="form-group step-appear">
            <div className="section-title">휴대폰 번호</div>
            <div className="phone-auth-group">
              <Input
                text=""
                inputType="text"
                placeholder="휴대폰 번호를 입력해주세요."
                value={phone}
                onChange={setPhone}
              />
              <Button
                type="button"
                className="auth-send-btn"
                onClick={sendPhoneCode}
              >
                인증받기
              </Button>
            </div>
            <div className="phone-auth-group">
              <Input
                text=""
                inputType="text"
                placeholder="인증번호 입력"
                value={phoneCode}
                onChange={setPhoneCode}
              />
              <Button
                type="button"
                className="auth-send-btn"
                onClick={phoneVerified ? verifyPhoneCodeNext : verifyPhoneCode}
              >
                {phoneVerified ? "다음" : "확인"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-group step-appear">
            <div className="section-title">새 비밀번호</div>
            <Input
              text=""
              inputType="password"
              placeholder="새 비밀번호를 입력하세요."
              value={pw}
              onChange={setPw}
            />
            <div className="password-hint">
              ※ 영문, 숫자, 특수문자 혼합 4~8자
            </div>
            <div className="section-title">새 비밀번호 확인</div>
            <Input
              text=""
              inputType="password"
              placeholder="새 비밀번호를 한 번 더 입력하세요."
              value={pwConfirm}
              onChange={setPwConfirm}
            />
            <Button
              type="button"
              className="submitbutton"
              onClick={resultFlag ? () => navigate("/login") : submitPwUpdate}
            >
              {resultFlag ? "로그인하기" : "변경하기"}
            </Button>
          </div>
        )}
        {message && <div className="error-message">{message}</div>}
      </div>
    </div>
  );
}

export default PwUpdatePage;
