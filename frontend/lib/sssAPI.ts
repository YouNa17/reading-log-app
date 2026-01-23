import { getIdToken } from "./auth";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * ✅ 認可付き fetch（共通関数）
 * - Firebase IDトークンを Authorization: Bearer に付ける
 * - 失敗時のエラーもここで統一
 */
const authFetch = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const token = await getIdToken(); // ← auth.ts から取得（未ログインなら throw される想定）

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  // body がある時だけ JSON として送る（GETでは付けない）
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  // 認可エラー（未ログイン or トークン不正）
  if (res.status === 401) {
    throw new Error("Unauthorized (401)");
  }

  // その他エラー
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API Error: ${res.status} ${text}`);
  }

  // 204 No Content 対応
  if (res.status === 204) {
    return null as unknown as T;
  }

  // JSON想定
  return (await res.json()) as T;
};

// /**
//  * ========== ここからアプリ固有 ==========
//  * 「読みたい本管理アプリ」想定
//  * バックエンドのAPIが /books を持っている想定
//  */

// export type Book = {
//   id: number;
//   title: string;
//   date?: string; // あるなら
// };

// /** ✅ 本一覧取得 */
// export const fetchBooks = async (): Promise<Book[]> => {
//   return authFetch<Book[]>("/books", { method: "GET" });
// };

// /** ✅ 本を登録 */
// export const createBook = async (payload: {
//   title: string;
//   date?: string;
// }): Promise<Book> => {
//   return authFetch<Book>("/books", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// };

// /** ✅ 本を更新（編集） */
// export const updateBook = async (
//   id: number,
//   payload: { title?: string; date?: string }
// ): Promise<Book> => {
//   return authFetch<Book>(`/books/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(payload),
//   });
// };

// /** ✅ 本を削除 */
// export const deleteBook = async (id: number): Promise<void> => {
//   await authFetch<void>(`/books/${id}`, { method: "DELETE" });
// };