"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, loginWithGoogle } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const friendlyError = (err: any) => {
    const code = err?.code as string | undefined;

    if (code === "auth/invalid-credential") return "メールアドレスかパスワードが違います";
    if (code === "auth/wrong-password") return "パスワードが違います";
    if (code === "auth/popup-closed-by-user") return "ポップアップが閉じられました";
    if (code === "auth/cancelled-popup-request") return "ログインがキャンセルされました";

    return err?.message ?? "ログインに失敗しました";
  };

  // メール/パスワード：フォーム送信
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/main"); // ✅ ログイン成功したら遷移
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // Google：ボタンクリック
  const onGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await loginWithGoogle();
      router.push("/main"); // ✅ ログイン成功したら遷移
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow p-6">
        <h1 className="text-2xl font-bold">ログイン</h1>
        <p className="mt-1 text-sm text-gray-500">メールアドレスとパスワードでログインします</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {/* エラー表示 */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* メール */}
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* メールログインボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 active:bg-gray-950 disabled:opacity-60"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>

          {/* 区切り */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Googleログインボタン */}
          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-3 shadow-md hover:shadow-xl hover:scale-105 transition duration-200 disabled:opacity-60"
          >
            Googleでログイン
          </button>

          {/* 下部リンク */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
            <span>アカウントがない？</span>
            <Link href="/signup" className="font-medium text-gray-900 underline">
              新規登録へ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}