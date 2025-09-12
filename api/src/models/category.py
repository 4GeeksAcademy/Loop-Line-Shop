from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import db
from .product import Product


class Category(db.Model):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    slug: Mapped[str] = mapped_column(String(50), nullable=False)
    image: Mapped[str] = mapped_column(String(255), nullable=False)

    product: Mapped[list["Product"]] = relationship(
        "Product", back_populates="category"
    )

    def __repr__(self):
        return f"<Category {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "image": self.image,
        }
