# -----------------
# crud、DB操作だけを書く
# -----------------

from sqlalchemy.orm import Session
from ..models import Book
from ..schemas.books import BookCreate

# DBからbooksを取得
def get_books(db: Session, user_id: int):
    return (
        db.query(Book)
        .filter(Book.user_id == user_id)
        .order_by(Book.created_at.desc())
        .all()
    )

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