import requests
from flask import jsonify


def product_routes(app):
    @app.route("/products", methods=["GET"])
    def get_products():
        try:
            data = requests.get("https://api.escuelajs.co/api/v1/products")
            data.raise_for_status()
            products = data.json()

            categories = {"Clothes", "Shoes"}

            products_allowed = [
                product
                for product in products
                if "category" in product
                and product["category"].get("name") in categories
            ]

            return jsonify(products_allowed), 200
        except requests.exceptions.RequestException as e:
            return jsonify(
                {"error": "Failed to fetch products", "details": str(e)}
            ), 400

    @app.route("/products/<int:product_id>", methods=["GET"])
    def get_product_by_id(product_id):
        try:
            data = requests.get(
                f"https://api.escuelajs.co/api/v1/products/{product_id}"
            )
            data.raise_for_status()
            products = data.json()
            return jsonify(products), 200
        except requests.exceptions.RequestException as e:
            return jsonify({"error": "Failed to fetch product", "details": str(e)}), 400
