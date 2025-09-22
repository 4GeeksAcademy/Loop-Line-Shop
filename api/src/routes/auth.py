from src.db import db
from src.models.user import Users
from flask import Blueprint, request, jsonify
from sqlalchemy import or_
import bcrypt
from flask_jwt_extended import (
    create_access_token,
    get_csrf_token,
    set_access_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)

auth = Blueprint("auth", __name__)


# ============================
#   REGISTER
# ============================
@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required_fields = ["user_name", "email", "password"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    user_name = data["user_name"]
    email = data["email"]
    password = data["password"]

    # Check for existing user
    existing_user = (
        db.session.query(Users)
        .filter(or_(Users.user_name == user_name, Users.email == email))
        .first()
    )

    if existing_user:
        return jsonify({"error": "Username or Email already registered"}), 400

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )

    # Create user
    new_user = Users(user_name=user_name, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# ============================
#   LOGIN
# ============================
@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    required_fields = ["email", "password"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    email = data["email"]
    password = data["password"]

    user = Users.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 400

    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        return jsonify({"error": "Password not correct"}), 400

    # Create JWT and CSRF token
    access_token = create_access_token(identity=str(user.id))
    csrf_token = get_csrf_token(access_token)

    response = jsonify(
        {
            "msg": "login successful",
            "user": user.serialize(),
            "user_id": user.id,
            "csrf_token": csrf_token,
        }
    )
    set_access_cookies(response, access_token)
    return response


# ============================
#   UPDATE USER
# ============================
@auth.route("/user", methods=["PUT"])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    user = Users.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    if "password" in data:
        # Hash the new password
        hashed_password = bcrypt.hashpw(
            data["password"].encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
        user.password_hash = hashed_password

    db.session.commit()

    return jsonify(
        {
            "msg": "Usuario actualizado correctamente",
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }
    ), 200


# ============================
#   LOGOUT
# ============================
@auth.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


# ============================
#   GET CURRENT USER
# ============================
@auth.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200
