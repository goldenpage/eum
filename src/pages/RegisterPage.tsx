import { Link, useNavigate } from "react-router";
import client from "../api/client";
import Input from "../components/Input";
import Button from "../components/Button";
import { use, useState } from "react";
import "../pages/css/RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [verifyPhone, setVerifyPhone] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwConfirmFlag, setPwConfirmFlag] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [storeType, setStoreType] = useState("일반음식점");
  const [storeCategory, setStoreCategory] = useState("한식");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [signAgree, setSignAgree] = useState(false);
  const [agreementAgree, setAgreementAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);
  const [message, setMessage] = useState("");

  const openNext = () => setStep((s) => s + 1);

  const STEP_TITLES = [
    "사업자번호", // step 1
    "휴대폰 인증", // step 2
    "기본정보", // step 3
    "비밀번호", // step 4
    "사업자 유형", // step 5
    "증명 서류", // step 6
    "약관 동의", // step 7
  ];

  // 1) 사업자번호 확인
  const submitBId = () => {
    if (username.replace(/\D/g, "").length < 10) {
      setMessage("사업자번호를 정확히 입력해주세요");
      return;
    }
    setMessage("");
    openNext();
  };

  // 2) 휴대폰 인증
  const sendPhoneCode = async () => {
    try {
      const res = await client.post("/api/auth/phone/code", { phone });
      setMessage(
        res.data.message ?? "인증번호를 발송 했습니다. (서버 로그 확인)",
      );
    } catch {
      setMessage("인증번호 발송에 실패했습니다.");
    }
  };

  const verifyPhoneCode = async () => {
    try {
      const res = await client.post("/api/auth/phone/verify", {
        phone,
        code: phoneCode,
      });
      if (res.data.message === "휴대폰 인증이 완료되었습니다.")
        setMessage("휴대폰 인증이 완료되었습니다 다음을 눌러주세요.");
      setVerifyPhone(true);
    } catch {
      setMessage("인증번호가 올바르지 않습니다.");
    }
  };

  const verifyPhoneCodeNext = () => {
    setMessage("");
    openNext();
  };

  // 3) 기본정보
  const submitBasic = () => {
    if (!storeName || !name || !email) {
      setMessage("상호명, 성명, 이메일을 모두 입력해주세요.");
      return;
    }
    setMessage("");
    openNext();
  };

  // 4) 비밀번호
  const submitPassword = () => {
    if (password.length < 4) {
      setMessage("비밀번호를 입력해주세요.");
      return;
    }
    if (password !== pwConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPwConfirmFlag(true);
    setMessage("비밀번호 확인이 되었습니다.");
  };

  const pwConfirmCheck = () => {
    setMessage("");
    openNext();
  };

  const backbtn = () => {
    setMessage("");

    if (step === 1) {
      navigate("/login");
    } else {
      setStep((s) => s - 1);
    }
  };

  // 5) 사업자 유형/상점 종류
  const submitBusiness = () => {
    if (!businessType) {
      setMessage("사업자 유형을 선택해주세요.");
      return;
    }
    setMessage("");
    openNext();
  };

  // 6) 사업자 증명 서류
  const submitDocument = () => {
    if (!documentFile) {
      setMessage("사업자 증명 서류를 첨부해주세요.");
      return;
    }
    setMessage("");
    openNext();
  };

  // 7) 최종 제출 (multipart)
  const submitAll = async () => {
    if (!signAgree || !agreementAgree) {
      setMessage("필수 약관에 동의 해주세요.");
      return;
    }
    if (!documentFile) {
      setMessage("사업자 증명 서류가 없습니다.");
      return;
    }

    const requestJson = {
      username,
      storeName,
      name,
      email,
      phone,
      password,
      businessType,
      storeType,
      storeCategory,
      signAgree,
      agreementAgree,
      marketingAgree,
    };

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(requestJson)], { type: "application/json" }),
    );
    formData.append("document", documentFile);

    try {
      const res = await client.post("/api/auth/register", formData);
      if (res.data.status === "PENDING") {
        setMessage("가입 신청 완료. 관리자 승인 후 로그인할 수 있습니다.");
      }
      navigate("/login");
    } catch {
      setMessage("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="signup-wrap">
      <form className="signup-box" onSubmit={(e) => e.preventDefault()}>
        <div className="step-header">
          {step > 0 && (
            <Button type="button" className="backbtn" onClick={backbtn}>
              ←
            </Button>
          )}
          <h2 className="step-title">{STEP_TITLES[step - 1]}</h2>
        </div>

        <div className="step-progress">
          <div
            className="step-progress-fill"
            style={{ width: `${(step / STEP_TITLES.length) * 100}%` }}
          />
        </div>

        {/* 1. 사업자번호 */}
        {step === 1 && (
          <div className="form-group step-appear">
            <Input
              text=""
              inputType="text"
              placeholder="사업자번호"
              value={username}
              onChange={setUsername}
            />
            <Button type="button" className="submitbutton" onClick={submitBId}>
              다음
            </Button>
          </div>
        )}

        {/* 2. 휴대폰 인증 */}
        {step === 2 && (
          <div className="form-group step-appear">
            <div className="phone-auth-group">
              <Input
                text=""
                inputType="text"
                placeholder="휴대폰 번호"
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
                placeholder="인증번호"
                value={phoneCode}
                onChange={setPhoneCode}
              />
              <Button
                type="button"
                className="auth-send-btn"
                onClick={verifyPhone ? verifyPhoneCodeNext : verifyPhoneCode}
              >
                {verifyPhone ? "다음" : "확인"}
              </Button>
            </div>
          </div>
        )}

        {/* 3. 기본정보 */}
        {step === 3 && (
          <div className="form-group step-appear">
            <div className="basic-info-section">
              <Input
                text=""
                inputType="text"
                placeholder="상호명"
                value={storeName}
                onChange={setStoreName}
              />
            </div>

            <div className="basic-info-section">
              <Input
                text=""
                inputType="text"
                placeholder="성명"
                value={name}
                onChange={setName}
              />
            </div>

            <div className="basic-info-section">
              <Input
                text=""
                inputType="email"
                placeholder="이메일"
                value={email}
                onChange={setEmail}
              />
            </div>

            <Button
              type="button"
              className="submitbutton"
              onClick={submitBasic}
            >
              다음
            </Button>
          </div>
        )}

        {/* 4. 비밀번호 */}
        {step === 4 && (
          <div className="form-group step-appear">
            <div className="basic-info-section">
              <Input
                text=""
                inputType="password"
                placeholder="비밀번호"
                value={password}
                onChange={setPassword}
              />
            </div>

            <div className="basic-info-section">
              <Input
                text=""
                inputType="password"
                placeholder="비밀번호 확인"
                value={pwConfirm}
                onChange={setPwConfirm}
              />
            </div>

            <Button
              type="button"
              className="submitbutton"
              onClick={pwConfirmFlag ? pwConfirmCheck : submitPassword}
            >
              다음
            </Button>
          </div>
        )}

        {/* 5. 사업자 유형 + 상점 종류 */}
        {step === 5 && (
          <div className="form-group step-appear">
            <div className="flex-row">
              <label className="click-label">
                <input
                  type="radio"
                  name="businessType"
                  value="간이과세자"
                  checked={businessType === "간이과세자"}
                  onChange={(e) => setBusinessType(e.target.value)}
                />{" "}
                간이과세자
              </label>
              <label className="click-label">
                <input
                  type="radio"
                  name="businessType"
                  value="일반과세자"
                  checked={businessType === "일반과세자"}
                  onChange={(e) => setBusinessType(e.target.value)}
                />{" "}
                일반과세자
              </label>
            </div>

            <div className="flex-row">
              <select
                className="store-select"
                value={storeType}
                onChange={(e) => setStoreType(e.target.value)}
              >
                <option value="일반음식점">일반음식점</option>
                <option value="휴게음식점">휴게음식점</option>
              </select>
              <select
                className="store-select"
                value={storeCategory}
                onChange={(e) => setStoreCategory(e.target.value)}
              >
                <option value="한식">한식</option>
                <option value="중식">중식</option>
                <option value="일식">일식</option>
              </select>
            </div>

            <Button
              type="button"
              className="submitbutton"
              onClick={submitBusiness}
            >
              다음
            </Button>
          </div>
        )}

        {/* 6. 사업자 증명 서류 */}
        {step === 6 && (
          <div className="form-group step-appear">
            <input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              className="submitbutton"
              onClick={submitDocument}
            >
              다음
            </Button>
          </div>
        )}

        {/* 7. 약관 동의 + 완료 */}
        {step === 7 && (
          <div className="form-group step-appear">
            <div className="checkbox-group">
              <label className="click-label">
                <input
                  type="checkbox"
                  checked={signAgree}
                  onChange={(e) => setSignAgree(e.target.checked)}
                />{" "}
                (필수) 개인정보 이용 동의
              </label>
              <label className="click-label">
                <input
                  type="checkbox"
                  checked={agreementAgree}
                  onChange={(e) => setAgreementAgree(e.target.checked)}
                />{" "}
                (필수) 개인정보 수집 동의
              </label>
              <label className="click-label">
                <input
                  type="checkbox"
                  checked={marketingAgree}
                  onChange={(e) => setMarketingAgree(e.target.checked)}
                />{" "}
                (선택) 마케팅 정보 수신 동의
              </label>
            </div>
            <Button type="button" className="submitbutton" onClick={submitAll}>
              회원가입 완료
            </Button>
          </div>
        )}

        {message && <div className="message error-message">{message}</div>}

        <div className="login-link">
          <Link to="/login">기존 계정으로 로그인</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
