# -----------------
# FastAPIの「玄関・司令塔」
# -----------------

from fastapi import FastAPI
from .routers import books

# FastAPIのアプリを作る
app = FastAPI()

# サーバーが問題なく起動しているかの確認
@app.get("/")
def helth_check():
    return {"status": "ok"}

# /booksに来たらbooks.routerに渡す
app.include_router(books.router)