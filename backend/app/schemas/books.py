# -------------------
# APIでやりとりするデータの「型・ルール」を定義するファイル（Pydanticの設計書）
# -------------------

# Pydanticの基本クラス
from pydantic import BaseModel
# Python標準の「日付型（年・月・日）
from datetime import date

# POST/books用の型
class BookCreate(BaseModel):
    target_date: date
    title: str
    
# APIがフロントに返すデータの型（レスポンス用）
class BookOut(BaseModel):
    id: int
    target_date: date
    title: str

    # SQLAlchemyのモデルをそのままBookOutに変換できるようにする
    class Config:
        from_attributes = True