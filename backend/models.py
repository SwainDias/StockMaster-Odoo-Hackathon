# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='staff')  # manager or staff
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Warehouse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_code = db.Column(db.String(20), unique=True)  # NEW: For UI short code
    location = db.Column(db.String(200))
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # NEW: One-to-many locations
    locations = db.relationship('Location', backref='warehouse', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'short_code': self.short_code,
            'location': self.location,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# NEW: Location model for sub-locations inside warehouses
class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_code = db.Column(db.String(20), unique=True)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'short_code': self.short_code,
            'warehouse_id': self.warehouse_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    unit_of_measure = db.Column(db.String(50), default='pcs')
    reorder_min = db.Column(db.Integer, default=0)
    cost = db.Column(db.Float, default=0.0)
    sales_price = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.relationship('Category', backref='products')
    stock_quants = db.relationship('StockQuant', lazy='dynamic')
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sku': self.sku,
            'category_id': self.category_id,
            'unit_of_measure': self.unit_of_measure,
            'reorder_min': self.reorder_min,
            'cost': self.cost,
            'sales_price': self.sales_price,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StockQuant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    # TODO: Add location_id = db.Column(db.Integer, db.ForeignKey('location.id')) when integrating locations
    quantity = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product', backref='stock_quants_all')      
    warehouse = db.relationship('Warehouse', backref='stock_quants')
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'warehouse_id': self.warehouse_id,
            'quantity': self.quantity,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Receipt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)  # e.g., WH/IN/0001
    vendor = db.Column(db.String(200), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    # NEW: responsible_id for UI "Responsible"
    responsible_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20), default='draft')  # draft, ready, done, canceled
    scheduled_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    validated_at = db.Column(db.DateTime)
    # Many-to-many for products
    receipt_lines = db.relationship('ReceiptLine', backref='receipt', lazy=True, cascade='all, delete-orphan')
    warehouse = db.relationship('Warehouse')
    responsible = db.relationship('User')  # NEW
    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'vendor': self.vendor,
            'warehouse_id': self.warehouse_id,
            'responsible_id': self.responsible_id,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'validated_at': self.validated_at.isoformat() if self.validated_at else None,
            'lines': [line.to_dict() for line in self.receipt_lines]
        }

class ReceiptLine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    demand_qty = db.Column(db.Float, default=0.0)  # Expected
    done_qty = db.Column(db.Float, default=0.0)    # Received
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product', backref='receipt_lines_ok')
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'demand_qty': self.demand_qty,
            'done_qty': self.done_qty,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Delivery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)  # e.g., WH/OUT/0001
    # CHANGED: customer -> delivery_address for UI
    delivery_address = db.Column(db.String(200), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    # NEW: responsible_id
    responsible_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20), default='draft')  # draft, ready, done, canceled
    scheduled_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    validated_at = db.Column(db.DateTime)
    delivery_lines = db.relationship('DeliveryLine', backref='delivery', lazy=True, cascade='all, delete-orphan')
    warehouse = db.relationship('Warehouse')
    responsible = db.relationship('User')  # NEW
    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'delivery_address': self.delivery_address,
            'warehouse_id': self.warehouse_id,
            'responsible_id': self.responsible_id,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'validated_at': self.validated_at.isoformat() if self.validated_at else None,
            'lines': [line.to_dict() for line in self.delivery_lines]
        }

class DeliveryLine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    delivery_id = db.Column(db.Integer, db.ForeignKey('delivery.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    demand_qty = db.Column(db.Float, default=0.0)  # To deliver
    done_qty = db.Column(db.Float, default=0.0)    # Delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product', backref='delivery_lines_ok')
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'demand_qty': self.demand_qty,
            'done_qty': self.done_qty,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Transfer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)
    from_warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    to_warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    status = db.Column(db.String(20), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    validated_at = db.Column(db.DateTime)
    transfer_lines = db.relationship('TransferLine', backref='transfer', lazy=True, cascade='all, delete-orphan')
    from_warehouse = db.relationship('Warehouse', foreign_keys=[from_warehouse_id])
    to_warehouse = db.relationship('Warehouse', foreign_keys=[to_warehouse_id])
    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'from_warehouse_id': self.from_warehouse_id,
            'to_warehouse_id': self.to_warehouse_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'validated_at': self.validated_at.isoformat() if self.validated_at else None,
            'lines': [line.to_dict() for line in self.transfer_lines]
        }

class TransferLine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    transfer_id = db.Column(db.Integer, db.ForeignKey('transfer.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product', backref='transfer_lines_ok')
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Adjustment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    reason = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    adjustment_lines = db.relationship('AdjustmentLine', backref='adjustment', lazy=True, cascade='all, delete-orphan')
    warehouse = db.relationship('Warehouse')
    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'warehouse_id': self.warehouse_id,
            'reason': self.reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'lines': [line.to_dict() for line in self.adjustment_lines]
        }

class AdjustmentLine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    adjustment_id = db.Column(db.Integer, db.ForeignKey('adjustment.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    counted_qty = db.Column(db.Float, default=0.0)
    previous_qty = db.Column(db.Float, default=0.0)
    difference = db.Column(db.Float, default=0.0)  # counted - previous
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product', backref='adjustment_lines_ok')
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'counted_qty': self.counted_qty,
            'previous_qty': self.previous_qty,
            'difference': self.difference,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StockMove(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50))  # From receipt/delivery etc.
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    from_location_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'))  # Can be null
    to_location_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'))    # Can be null
    quantity = db.Column(db.Float, default=0.0)
    move_type = db.Column(db.String(20))  # receipt, delivery, transfer, adjustment
    state = db.Column(db.String(20), default='done')  # draft, done
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product', backref='stock_moves')
    user = db.relationship('User')
    from_location = db.relationship('Warehouse', foreign_keys=[from_location_id])
    to_location = db.relationship('Warehouse', foreign_keys=[to_location_id])
    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'product_id': self.product_id,
            'from_location_id': self.from_location_id,
            'to_location_id': self.to_location_id,
            'quantity': self.quantity,
            'move_type': self.move_type,
            'state': self.state,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }