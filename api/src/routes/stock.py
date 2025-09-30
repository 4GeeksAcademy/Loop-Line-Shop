import requests
from flask import jsonify
from src.models.stock import Stock


def product_routes(app):
    @app.route("/stock", methods=["GET"])
    def get_products():
        try:
            stocks = Stock.query.all()
            return jsonify([s.serialize() for s in stocks]), 200
        except requests.exceptions.RequestException as e:
            return jsonify(
                {"error": "Failed to fetch products", "details": str(e)}
            ), 400
