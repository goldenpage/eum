import client, { AT } from "./client";

// export const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault(); // 폼 기본동작(새로고침) 막기(필수)
//     if (loading) return; // 중복 제출 방지
//     setError("");
//     setLoading(true);

//     try {
//       const res = await client.post("/api/auth/login", { username, password });

//       const token = res.headers["authorization"];
//       if (!token) throw new Error("토큰 없음");

//       sessionStorage.setItem(AT, token); // AT토큰 sessionStorage저장
//       clearUser();

//       const user = await fetchUser();
//       navigate(isAdminUser(user) ? "/manager" : "/foodmaterials", {
//         replace: true,
//       });
//     } catch {
//       setError("아이디 또는 비밀번호를 확인해주세요");
//     } finally {
//       setLoading(false); //성공이든 실패든 무조건 로딩 끄기
//     }
//   };

export async function logout() {
  try {
    await client.post("/api/auth/logout");
  } catch {
    // 서버 로그아웃 엔드포인트가 없거나 세션이 만료돼도 클라이언트 로그아웃은 진행한다.
  } finally {
    sessionStorage.removeItem(AT);
  }
}
