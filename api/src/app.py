import os
import time
from src.utils import generate_sitemap
from src.routes.auth import auth_routes
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_migrate import Migrate
from src.db import db
from src.admin.setup_admin import setup_admin
from flask_cors import CORS
from src.routes.cart import cart
from src.routes.checkout import checkout


from flask_jwt_extended import (
    JWTManager,
)

load_dotenv()
app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173", "https://*.github.dev"],
)
start_time = time.time()

db_url = os.getenv("DATABASE_URL")

if db_url is not None:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

jwt_key = os.getenv("JWT_SECRET_KEY")

# JWT
app.config["JWT_SECRET_KEY"] = jwt_key
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
app.config["JWT_CSRF_IN_COOKIES"] = True
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_CSRF_CHECK_FORM"] = True

jwt = JWTManager(app)

MIGRATE = Migrate(app, db)
db.init_app(app)
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, supports_credentials=True)


@app.route("/")
def sitemap():
    return generate_sitemap(app)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "uptime": round(time.time() - start_time, 2)}), 200


auth_routes(app)
app.register_blueprint(cart)
app.register_blueprint(checkout)

# 🔍 Debug: ver todas las rutas registradas
with app.app_context():
    print("🔎 Rutas registradas en Flask:")
    print(app.url_map)


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=False)
