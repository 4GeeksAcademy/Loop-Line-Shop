from flask import Blueprint, request, jsonify
from src.models.cart import CartItem
from src.db import db
import requests
import os

cart = Blueprint("cart", __name__)

PLATZI_API = "https://api.escuelajs.co/api/v1/products"


# Añadir producto al carrito
@cart.route("/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    # Validar que el producto exista en Platzi API
    r = requests.get(f"{PLATZI_API}/{product_id}")
    if r.status_code != 200:
        return jsonify({"error": "Producto no encontrado"}), 404

    item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    db.session.add(item)
    db.session.commit()

    return jsonify(item.serialize()), 201


# Ver carrito de un usuario
@cart.route("/cart", methods=["GET"])
def get_cart():
    user_id = request.args.get("user_id")
    items = CartItem.query.filter_by(user_id=user_id).all()

    result = []
    for item in items:
        r = requests.get(f"{PLATZI_API}/{item.product_id}")
        if r.status_code == 200:
            product = r.json()
            result.append(
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "name": product.get("title"),
                    "image": product.get("images")[0]
                    if product.get("images")
                    else None,
                    "price": product.get("price"),
                    "quantity": item.quantity,
                    "subtotal": item.quantity * product.get("price", 0),
                }
            )

    total = sum([i["subtotal"] for i in result])
    return jsonify({"items": result, "total": total}), 200


# PUT /api/cart/<item_id> → actualizar cantidad
@cart.route("/cart/<int:item_id>", methods=["PUT"])
def update_cart_item(item_id):
    data = request.get_json()
    new_quantity = data.get("quantity")

    if new_quantity is None or new_quantity < 1:
        return jsonify({"error": "Cantidad inválida"}), 400

    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Item no encontrado"}), 404

    item.quantity = new_quantity
    db.session.commit()

    return jsonify(item.serialize()), 200


# DELETE /api/cart/<item_id> → eliminar producto del carrito
@cart.route("/cart/<int:item_id>", methods=["DELETE"])
def delete_cart_item(item_id):
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Item no encontrado"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item eliminado"}), 200
