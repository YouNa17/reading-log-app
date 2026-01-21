# ---------------------
# DBのテーブル構造をPythonで定義するファイル、PostgreSQLに作られるテーブルの設計図
# ---------------------

# SQLAlchemyの「DB型」をimport
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from datetime import datetime
# BaseはSQLAlchemyの基底クラス、これを継承したクラスがDBテーブルになる
from .database import Base

# 仮user_id
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Bookテーブルを表すクラス（クラス名は単体系が一般的）
class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    target_date = Column(Date, nullable=False)
    created_at =Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )