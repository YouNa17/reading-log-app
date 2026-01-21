'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Book, BookFormData } from '@/types/book';
import {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    logout
} from '@/lib/api';

export default function MainPage() {
    const router = useRouter();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [newBook, setNewBook] = useState<BookFormData>({
        title: '',
        target_date: '',
    });

    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [editFormData, setEditFormData] = useState<BookFormData>({
        title: '',
        target_date: '',
    });

    const [deletingBookId, setDeletingBookId] = useState<number | null>(null);

    // 認証チェック & 初回データ取得
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/');
            } else {
                loadBooks();
            }
        });

        return () => unsubscribe();
    }, [router]);

    // 本の一覧を取得
    const loadBooks = async () => {
        setLoading(true);
        const result = await getBooks();

        if (result.data) {
            setBooks(result.data);
        } else if (result.error) {
            showMessage(result.error);
        }

        setLoading(false);
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    // 新規登録
    const handleCreate = async () => {
        if (!newBook.title || !newBook.target_date) {
            showMessage('日付と本の名前を入力してください');
            return;
        }

        setSubmitting(true);
        const result = await createBook(newBook);

        if (result.data) {
            showMessage('登録完了しました');
            setNewBook({ title: '', target_date: '' });
            await loadBooks();
        } else if (result.error) {
            showMessage(result.error);
        }

        setSubmitting(false);
    };

    // 編集ボタン押下
    const handleEditClick = (book: Book) => {
        setEditingBook(book);
        setEditFormData({
            title: book.title,
            target_date: book.target_date,
        });
    };

    // 更新
    const handleUpdate = async () => {
        if (!editingBook) return;

        if (!editFormData.title || !editFormData.target_date) {
            showMessage('日付と本の名前を入力してください');
            return;
        }

        setSubmitting(true);
        const result = await updateBook(editingBook.id, editFormData);

        if (result.data) {
            showMessage('更新完了しました');
            setEditingBook(null);
            await loadBooks();
        } else if (result.error) {
            showMessage(result.error);
        }

        setSubmitting(false);
    };

    // 削除確認表示
    const handleDeleteClick = (id: number) => {
        setDeletingBookId(id);
    };

    // 削除実行
    const handleDeleteConfirm = async () => {
        if (deletingBookId === null) return;

        setSubmitting(true);
        const result = await deleteBook(deletingBookId);

        if (result.data === undefined && !result.error) {
            showMessage('削除完了しました');
            setDeletingBookId(null);
            await loadBooks();
        } else if (result.error) {
            showMessage(result.error);
        }

        setSubmitting(false);
    };

    const handleDeleteCancel = () => {
        setDeletingBookId(null);
    };

    // ログアウト
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            showMessage('ログアウトに失敗しました');
        }
    };

    // 日付フォーマット
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl text-gray-600">読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* ヘッダー */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        📚 読んだ本の記録
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        ログアウト
                    </button>
                </div>

                {/* メッセージ */}
                {message && (
                    <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg border border-blue-300">
                        ✓ {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* 左側：一覧 */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                            📖 本の一覧 ({books.length}冊)
                        </h2>

                        {books.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg mb-2">📭</p>
                                <p>まだ本が登録されていません</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {books.map((book) => (
                                    <div
                                        key={book.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-3"
                                    >
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-500">{formatDate(book.target_date)}</div>
                                            <div className="text-lg font-medium text-gray-800">{book.title}</div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(book)}
                                                disabled={submitting}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(book.id)}
                                                disabled={submitting}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 右側：フォーム */}
                    <div className="space-y-6">
                        {/* 新規登録 */}
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                                ➕ 新規登録
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        日付 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={newBook.target_date}
                                        onChange={(e) => setNewBook({ ...newBook, target_date: e.target.value })}
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        本の名前 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newBook.title}
                                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                        placeholder="例：吾輩は猫である"
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={handleCreate}
                                    disabled={submitting}
                                    className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                >
                                    {submitting ? '処理中...' : '📝 登録'}
                                </button>
                            </div>
                        </div>

                        {/* 編集フォーム */}
                        {editingBook && (
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2 border-blue-300">
                                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                                    ✏️ 編集
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            日付 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={editFormData.target_date}
                                            onChange={(e) => setEditFormData({ ...editFormData, target_date: e.target.value })}
                                            disabled={submitting}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            本の名前 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.title}
                                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                            disabled={submitting}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            disabled={submitting}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {submitting ? '処理中...' : '✓ 更新'}
                                        </button>
                                        <button
                                            onClick={() => setEditingBook(null)}
                                            disabled={submitting}
                                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                            キャンセル
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 削除確認モーダル */}
                {deletingBookId !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold mb-4">⚠️ 削除してOKですか？</h3>
                            <p className="text-sm text-gray-600 mb-6">削除した本は元に戻せません。</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                >
                                    {submitting ? '処理中...' : '削除'}
                                </button>
                                <button
                                    onClick={handleDeleteCancel}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}