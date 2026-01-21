//データベースから取得するデータの型
export interface Book {
    id: number;
    user_id: number;
    title: string;
    target_date: string;  // "2026-01-20"
    created_at: string;
    updated_at: string;
}

//新規登録・編集フォームで入力するデータの型
export interface BookFormData {
    title: string;
    target_date: string;
}

// GETのレスポンス型
export interface GetBooksResponse {
    books: Book[];
}

// APIレスポンス型
export interface ApiResponse<T> {
    data?: T; //成功時のデータ
    error?: string; //失敗時のエラーメッセージ
}