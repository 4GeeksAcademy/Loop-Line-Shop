from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.cart import CartItem
from src.models.order import Order, OrderItem
from src.db import db
import requests

checkout = Blueprint("checkout", __name__)

PLATZI_API = "https://api.escuelajs.co/api/v1/products"


@checkout.route("/checkout", methods=["POST"])
# puedes quitar @jwt_required si de momento pasas user_id por body
# @jwt_required()
def create_order():
    data = request.get_json()
    user_id = data.get("user_id")  # o get_jwt_identity()

    # Traer los items del carrito
    items = CartItem.query.filter_by(user_id=user_id).all()
    if not items:
        return jsonify({"error": "Carrito vacío"}), 400

    order_total = 0
    order_items = []

    for ci in items:
        r = requests.get(f"{PLATZI_API}/{ci.product_id}")
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

    # Crear Order
    order = Order(user_id=user_id, total=order_total, status="created")
    db.session.add(order)
    db.session.flush()  # para tener order.id

    # Crear OrderItems
    for oi in order_items:
        item = OrderItem(
            order_id=order.id,
            product_id=oi["product_id"],
            name=oi["name"],
            image=oi["image"],
            unit_price=oi["unit_price"],
            quantity=oi["quantity"],
        )
        db.session.add(item)

    # Vaciar carrito
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify(order.serialize()), 201
