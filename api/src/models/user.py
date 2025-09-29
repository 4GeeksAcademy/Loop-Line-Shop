from sqlalchemy import String, VARCHAR, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src.db import db


class Users(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    user_name: Mapped[str] = mapped_column(String(50), nullable=False)
    password_hash: Mapped[str] = mapped_column(VARCHAR(60), nullable=False)
    email: Mapped[str] = mapped_column(String(50), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="user", nullable=False)
    # created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)

    def __repr__(self):
        return f"<User {self.user_name}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "email": self.email,
            "role": self.role,
        }
