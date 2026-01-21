# --------------------
# HTTPリクエスト（URL）と、内部処理（CRUD）を繋ぐ窓口
# --------------------

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import books as crud_books
from ..schemas.books import BookCreate,BookOut

# /books => このrouterに書いたAPIは全部/books配下になる
# tags => Swaggerでグルーピングするため
router = APIRouter(
    prefix="/books",
    tags=["books"]
)

# GET / books
@router.get("/", response_model=list[BookOut])
def read_books(db: Session = Depends(get_db)):
    user_id = 1  # 仮（あとで Firebase）=> Firebase ID Tokenをuser_idに変換
    # CRUDに投げる
    return crud_books.get_books(db, user_id)

# POST / book
@router.post("/", response_model=BookOut)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db)
):
    user_id = 1  # 仮（あとで Firebase）
    return crud_books.create_book(db, user_id, book)