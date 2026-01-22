import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,

  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';



//メール/パスワード：ログイン
export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}
// Google：ログイン（ポップアップ）
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

// ログアウト
export const logout =  async() => {
    await signOut(auth);
};

// ログイン状態を監視（必要になったら使う）
export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

//IDトークンを取得する
export const getIdToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  return await user.getIdToken();
};