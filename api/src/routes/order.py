# src/routes/order.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.order import Order

orders = Blueprint("orders", __name__)


@orders.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    """
    Devuelve el historial de pedidos del usuario autenticado (y sus items relacionados).
    Ejemplo: GET /orders
    """
    user_id = int(get_jwt_identity())
    orders = (
        Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    )

    return jsonify([order.serialize() for order in orders]), 200


@orders.route("/orders/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    """
    Devuelve el detalle de una orden específica del usuario autenticado.
    Ejemplo: GET /orders/5
    """
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({"error": "Orden no encontrada"}), 404

    return jsonify(order.serialize()), 200
