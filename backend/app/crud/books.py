# -----------------
# crud、DB操作だけを書く
# -----------------

from sqlalchemy.orm import Session
from ..models import Book
from ..schemas.books import BookCreate, BookUpdate

# DBからbooksを取得
def get_books(db: Session, user_id: int):
    return (
        db.query(Book)
        .filter(Book.user_id == user_id)
        .order_by(Book.created_at.desc())
        .all()
    )

# DBにbookを新規登録
def create_book(db: Session, user_id: int, book: BookCreate):
    # Pythonオブジェクトを作る
    db_book = Book(
        user_id=user_id,
        title=book.title,
        target_date=book.target_date,
    )
    # DBに追加予約
    db.add(db_book)
    # DBに確定（insert）
    db.commit()
    # DBで採番されたidを取得
    db.refresh(db_book)
    # 追加された一件を返す
    return db_book

# bookの更新
def update_book(
    db: Session,
    book_id: int,
    user_id: int,
    book: BookUpdate
):
    # 既存の更新対象の本を取得
    db_book = (
        db.query(Book)
        .filter(Book.id == book_id, Book.user_id == user_id)
        .first()
    )

    if not db_book:
        return None

    # 更新
    db_book.title = book.title
    db_book.target_date = book.target_date

    db.commit()
    db.refresh(db_book)

    return db_book

# bookの削除
def delete_book(
    db: Session,
    book_id: int,
    user_id: int,
):
    # 削除対象を取得
    db_book = (
        db.query(Book)
        .filter(Book.id == book_id, Book.user_id == user_id)
        .first()
    )

    if not db_book:
        return None

    # 削除
    db.delete(db_book)
    db.commit()

    return db_book