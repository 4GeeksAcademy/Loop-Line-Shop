from src.db import db
from flask import Blueprint, request, jsonify
from src.models.user import Users
from sqlalchemy import or_
import bcrypt
import os
from flask_jwt_extended import (
    create_access_token,
    get_csrf_token,
    set_access_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)

auth = Blueprint("auth", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ============================
#   REGISTER
# ============================
@auth.route("/register", methods=["POST"])
def register():
    # Si el frontend envía JSON (sin foto)
    if request.is_json:
        data = request.get_json()
        user_name = data.get("user_name")
        email = data.get("email")
        password = data.get("password")
    else:
        # Si el frontend envía FormData (con foto)
        user_name = request.form.get("user_name")
        email = request.form.get("email")
        password = request.form.get("password")

    if not user_name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

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

    # Foto opcional
    foto = None
    if "foto" in request.files:
        file = request.files["foto"]
        if file.filename != "":
            foto = file.filename
            file.save(os.path.join(UPLOAD_FOLDER, foto))

    # Create user
    new_user = Users(
        user_name=user_name,
        email=email,
        password_hash=hashed_password,
        foto=foto,  # Asegúrate de que tu modelo Users tenga este campo
    )
    db.session.add(new_user)
    db.session.commit()

    # 🔑 Crear token JWT automáticamente al registrarse
    access_token = create_access_token(identity=str(new_user.id))
    csrf_token = get_csrf_token(access_token)

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": new_user.serialize(),
                "user_id": new_user.id,
                "access_token": access_token,
                "csrf_token": csrf_token,
            }
        ),
        201,
    )


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
            "access_token": access_token,
            "csrf_token": csrf_token,
        }
    )
    set_access_cookies(response, access_token)
    return response


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


# ============================
#   UPDATE USER
# ============================
@auth.route("/update-user", methods=["PUT"])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Si el frontend manda JSON
    if request.is_json:
        data = request.get_json()
        user.user_name = data.get("user_name", user.user_name)
        user.email = data.get("email", user.email)
        user.direccion = data.get("direccion", user.direccion)
        user.codigo_postal = data.get("codigo_postal", user.codigo_postal)
        user.region = data.get("region", user.region)
    else:
        # Si manda FormData (cuando sube foto)
        user.user_name = request.form.get("user_name", user.user_name)
        user.email = request.form.get("email", user.email)
        user.direccion = request.form.get("direccion", user.direccion)
        user.codigo_postal = request.form.get("codigo_postal", user.codigo_postal)
        user.region = request.form.get("region", user.region)

        if "foto" in request.files:
            file = request.files["foto"]
            if file.filename != "":
                filename = file.filename
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                user.foto = filename

    db.session.commit()
    return jsonify(
        {"message": "User updated successfully", "user": user.serialize()}
    ), 200
