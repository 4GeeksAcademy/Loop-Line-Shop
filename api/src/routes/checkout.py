from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.cart import CartItem
from src.models.order import Order, OrderItem
from src.db import db
import os

checkout = Blueprint("checkout", __name__)

PLATZI_API = "https://api.escuelajs.co/api/v1/products"


@checkout.route("/checkout", methods=["POST"])
@jwt_required()
def create_order():
    data = request.get_json()
    user_id = int(get_jwt_identity())
    print("🔎 DEBUG checkout:")
    print("data:", data)
    print("user_id from JWT:", user_id)

    address = data.get("address")
    payment_method = data.get("payment_method")

    if not user_id:
        return jsonify({"error": "Falta user_id"}), 400
    if not address or not payment_method:
        return jsonify({"error": "Faltan datos de envío o método de pago"}), 400

    # 🔴 Checkout real
    items = CartItem.query.filter_by(user_id=user_id).all()
    if not items:
        return jsonify({"error": "Carrito vacío"}), 400

    order_total = 0
    order_items = []

    for ci in items:
        r = request.get(f"{PLATZI_API}/{ci.product_id}")
        if r.status_code != 200:
            return jsonify({"error": f"Producto {ci.product_id} no encontrado"}), 404

        product = r.json()
        price = product.get("price", 0)
        subtotal = price * ci.quantity
        order_total += subtotal

        order_items.append(
            {
                "product_id": ci.product_id,
                "name": product.get("title"),
                "image": product.get("images")[0] if product.get("images") else None,
                "unit_price": price,
                "quantity": ci.quantity,
            }
        )

    order = Order(
        user_id=user_id,
        address=address,
        payment_method=payment_method,
        total=order_total,
        status="confirmed",
    )
    db.session.add(order)
    db.session.flush()

    for oi in order_items:
        db.session.add(
            OrderItem(
                order_id=order.id,
                product_id=oi["product_id"],
                name=oi["name"],
                image=oi["image"],
                unit_price=oi["unit_price"],
                quantity=oi["quantity"],
            )
        )

    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify(order.serialize()), 201
