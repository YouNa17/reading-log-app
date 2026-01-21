# ----------------
# DBに接続するための共通インフラ
# DB接続＋セッション管理＋FastAPI用の橋渡し
# ----------------

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# .envを読み込む,.envファイルをPythonから使えるようにする
load_dotenv()

# 環境変数からDB URLを取得
DATABASE_URL =os.getenv("DATABASE_URL")

# DBエンジン作成（DBへの入り口を作る）
engine = create_engine(DATABASE_URL)

# セッション作成（DB操作の単位、１リクエスト＝１セッション）
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# モデルの親クラス、テーブル定義の土台
Base = declarative_base()

# FastAPI用：DBセッションを取得する関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()