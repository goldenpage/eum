import client, { AT } from "./client";

export async function logout() {
  try {
    await client.post("/api/auth/logout");
  } catch {
    // 서버 로그아웃 엔드포인트가 없거나 세션이 만료돼도 클라이언트 로그아웃은 진행한다.
  } finally {
    sessionStorage.removeItem(AT);
  }
}
