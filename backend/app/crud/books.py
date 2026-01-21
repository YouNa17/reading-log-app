# -----------------
# crud、DB操作だけを書く
# -----------------

from sqlalchemy.orm import Session
from ..models import Book

# DBからbooksを取得
def get_books(db: Session, user_id: int):
    return (
        db.query(Book)
        .filter(Book.user_id == user_id)
        .order_by(Book.created_at.desc())
        .all()
    )