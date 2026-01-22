//API関数ファイル

import { auth } from './firebase';
import { Book, BookFormData, ApiResponse } from '@/src/types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 認証トークンを取得する関数
//一時的に置き換え
async function getAuthToken(): Promise<string> {
    // 一時的にダミートークンを返す
    return 'dummy-token';
}

// async function getAuthToken(): Promise<string> {
//     const currentUser = auth.currentUser;

//     if (!currentUser) {
//         throw new Error('ログインしていません');
//     }

//     const token = await currentUser.getIdToken();
//     return token;
// }

// 共通fetch関数
async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    try {
        const token = await getAuthToken();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.detail || `HTTPエラー: ${response.status}`);
        }

        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('不明なエラーが発生しました');
    }
}

// 本の一覧取得
export async function getBooks(): Promise<ApiResponse<Book[]>> {
    try {
        const response = await fetchWithAuth('/books/', {
            method: 'GET',
        });

        const data: Book[] = await response.json();
        return { data };
    } catch (error) {
        console.error('Failed to fetch books:', error);
        return {
            error: error instanceof Error ? error.message : 'データの取得に失敗しました'
        };
    }
}

// 本の新規登録
export async function createBook(
    bookData: BookFormData
): Promise<ApiResponse<Book>> {
    try {
        const response = await fetchWithAuth('/books/', {
            method: 'POST',
            body: JSON.stringify(bookData),
        });

        const data: Book = await response.json();
        return { data };
    } catch (error) {
        console.error('Failed to create book:', error);
        return {
            error: error instanceof Error ? error.message : '登録に失敗しました'
        };
    }
}

// 本の更新
export async function updateBook(
    id: number,
    bookData: BookFormData
): Promise<ApiResponse<Book>> {
    try {
        const response = await fetchWithAuth(`/books/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(bookData),
        });

        const data: Book = await response.json();
        return { data };
    } catch (error) {
        console.error('Failed to update book:', error);
        return {
            error: error instanceof Error ? error.message : '更新に失敗しました'
        };
    }
}

// 本の削除
export async function deleteBook(id: number): Promise<ApiResponse<void>> {
    try {
        await fetchWithAuth(`/books/${id}/`, {
            method: 'DELETE',
        });

        return { data: undefined };
    } catch (error) {
        console.error('Failed to delete book:', error);
        return {
            error: error instanceof Error ? error.message : '削除に失敗しました'
        };
    }
}

// ログアウト
export async function logout(): Promise<void> {
    await auth.signOut();
}