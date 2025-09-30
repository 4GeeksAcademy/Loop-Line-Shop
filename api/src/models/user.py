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

    # 🔹 Nuevos campos para el perfil
    direccion: Mapped[str] = mapped_column(String(200), nullable=True)
    codigo_postal: Mapped[str] = mapped_column(String(20), nullable=True)
    region: Mapped[str] = mapped_column(String(100), nullable=True)
    foto: Mapped[str] = mapped_column(
        String(200), nullable=True
    )  # guardamos solo el nombre del archivo

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def __repr__(self):
        return f"<User {self.user_name}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "email": self.email,
            "role": self.role,
            "direccion": self.direccion,
            "codigo_postal": self.codigo_postal,
            "region": self.region,
            "foto": self.foto,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
