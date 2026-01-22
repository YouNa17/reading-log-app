# -----------------
# FastAPIの「玄関・司令塔」
# -----------------

from fastapi import FastAPI
from .routers import books
from .database import engine, Base
from . import models
from fastapi.middleware.cors import CORSMiddleware

# FastAPIのアプリを作る
app = FastAPI()

# cors設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FIXME:アプリ起動時にテーブルがなければ作る処理 => いずれAlembic
Base.metadata.create_all(bind=engine)

# サーバーが問題なく起動しているかの確認
@app.get("/")
def helth_check():
    return {"status": "ok"}

# /booksに来たらbooks.routerに渡す
app.include_router(books.router)