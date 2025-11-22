# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes import init_routes
from models import db

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change in production
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stockmaster.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key-here'  # Change in production
    CORS(app)  # Enable CORS for React frontend
    db.init_app(app)
    jwt = JWTManager(app)
    init_routes(app)
    with app.app_context():
        db.create_all()
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)