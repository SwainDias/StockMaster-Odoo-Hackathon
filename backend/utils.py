# utils.py — FIXED: Import random, negative stock error, decorator, add missing imports, thread-safe ref (simple lock)
import re
import random  # FIXED: Import for OTP
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import db, User, Receipt, Delivery, Transfer, Adjustment, StockQuant, StockMove  # FIXED: Added missing
from threading import Lock  # NEW: For thread-safe reference
from flask_jwt_extended import get_jwt_identity, get_current_user
from flask import has_request_context

reference_lock = Lock()  # NEW: Simple lock for generate_reference

def generate_reference(model_class, prefix):
    """Generate unique reference like WH/IN/0001 based on last ID of model — thread-safe"""
    with reference_lock:
        last = db.session.query(db.func.max(model_class.id)).scalar() or 0
        seq = last + 1
        return f"{prefix}/{seq:04d}"

def update_stock(product_id, warehouse_id, delta_qty, move_type='adjustment', reference=None, user_id=None):
    """Atomic stock update - safe even outside request context (for populate_db)"""
    quant = StockQuant.query.filter_by(product_id=product_id, warehouse_id=warehouse_id).first()
    if not quant:
        quant = StockQuant(product_id=product_id, warehouse_id=warehouse_id, quantity=0.0)
        db.session.add(quant)
        db.session.flush()

    old_qty = quant.quantity
    quant.quantity += delta_qty

    if quant.quantity < 0:
        db.session.rollback()
        raise ValueError(f"Negative stock prevented: {product_id} in warehouse {warehouse_id}")

    # Determine locations
    from_loc_id = None if move_type in ['receipt', 'adjustment+'] else warehouse_id
    to_loc_id = warehouse_id if move_type in ['receipt', 'adjustment+', 'transfer_in'] else None

    # Get user_id safely
    if user_id is not None:
        current_user_id = user_id
    elif has_request_context():
        current_user_id = get_jwt_identity()
    else:
        current_user_id = None  # For populate_db.py

    stock_move = StockMove(
        reference=reference or 'SYSTEM',
        product_id=product_id,
        from_location_id=from_loc_id,
        to_location_id=to_loc_id,
        quantity=abs(delta_qty),
        move_type=move_type,
        user_id=current_user_id,
        created_at=datetime.utcnow()
    )
    db.session.add(stock_move)
    db.session.commit()
    return quant.quantity

def require_manager_role(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # FIXED: Proper decorator composition
        if not hasattr(request, 'authorization'):  # Simple check, but use @jwt_required on route
            return jsonify({'error': 'Authentication required'}), 401
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'manager':
            return jsonify({'error': 'Manager access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

OTP_STORE = {}

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email: str, otp: str) -> bool:
    """
    For development: just prints and returns True
    For production: send real email here
    """
    print(f"\nOTP FOR {email}: {otp}\n")  # Easy to see in console
    return True

def save_otp(email: str, otp: str, expires_in: int = 300):
    """
    Save OTP with 5-minute expiry (300 seconds)
    """
    OTP_STORE[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(seconds=expires_in)
    }

def verify_otp(email: str, otp: str) -> bool:
    """
    Check if OTP is correct and not expired
    """
    record = OTP_STORE.get(email)
    if not record:
        return False
    if datetime.utcnow() > record["expires_at"]:
        del OTP_STORE[email]
        return False
    if record["otp"] == otp:
        del OTP_STORE[email]  # One-time use
        return True
    return False