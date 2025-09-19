from datetime import datetime
from src.db import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    total = db.Column(db.Float, nullable=False, default=0.0)
    status = db.Column(db.String(50), default="pending", nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)

    items = db.relationship(
        "OrderItem", backref="order", cascade="all, delete-orphan", lazy=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "address": self.address,
            "payment_method": self.payment_method,
            "total": round(self.total, 2),
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.serialize() for item in self.items],
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255))
    unit_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    @property
    def subtotal(self):
        return round(self.quantity * self.unit_price, 2)

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "name": self.name,
            "image": self.image,
            "unit_price": self.unit_price,
            "quantity": self.quantity,
            "subtotal": self.subtotal,
        }
