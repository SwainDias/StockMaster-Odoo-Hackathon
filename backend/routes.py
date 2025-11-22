# routes.py — UPDATED FOR FRONTEND FUNCTIONALITY: Locations, Responsible, Short Codes, Late Flags, Enhanced Moves
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User, Warehouse, Location, Category, Product, StockQuant, Receipt, ReceiptLine, Delivery, DeliveryLine, Transfer, TransferLine, Adjustment, AdjustmentLine, StockMove
from utils import generate_reference, update_stock, require_manager_role
from utils import generate_otp, send_otp_email, save_otp, verify_otp
api = Blueprint('api', __name__)

# Helper to replace lines
def replace_lines(model_line_class, parent_id, lines_data):
    # FIXED: Use correct parent key name
    parent_key = 'receipt_id' if model_line_class.__name__ == 'ReceiptLine' else \
                 'delivery_id' if model_line_class.__name__ == 'DeliveryLine' else \
                 'transfer_id' if model_line_class.__name__ == 'TransferLine' else \
                 'adjustment_id'
    old_lines = model_line_class.query.filter_by(**{parent_key: parent_id}).all()
    for line in old_lines:
        db.session.delete(line)
    for line_data in lines_data:
        line_data[parent_key] = parent_id
        db.session.add(model_line_class(**line_data))

# 1. Auth (unchanged)
@api.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        user = User(email=data['email'])
        user.set_password(data['password'])
        user.role = data.get('role', 'staff')
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            token = create_access_token(identity=str(user.id))
            return jsonify({'access_token': token, 'user': user.to_dict()})
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.json
        if not data or not data.get('email'):
            return jsonify({'error': 'Email required'}), 400
        email = data['email'].lower().strip()
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        otp = generate_otp()
        save_otp(email, otp, expires_in=300)
        if send_otp_email(email, otp):
            return jsonify({
                "message": "OTP sent successfully",
                "otp": otp,
                "hint": "Check console or this response for OTP (dev mode)"
            }), 200
        else:
            return jsonify({'error': 'Failed to send OTP'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/auth/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        required = ['email', 'otp', 'new_password']
        if not data or not all(k in data for k in required):
            return jsonify({'error': 'Email, OTP, and new_password required'}), 400
        email = data['email'].lower().strip()
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if not verify_otp(email, data['otp']):
            return jsonify({'error': 'Invalid or expired OTP'}), 400
        user.set_password(data['new_password'])
        db.session.commit()
        return jsonify({'message': 'Password reset successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/auth/me', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        if request.method == 'GET':
            return jsonify(user.to_dict())
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        user.email = data.get('email', user.email)
        if 'password' in data:
            user.set_password(data['password'])
        db.session.commit()
        return jsonify({'message': 'Profile updated', 'user': user.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 2. Warehouses — UPDATED: short_code
@api.route('/warehouses', methods=['GET', 'POST'])
@jwt_required()
def warehouses():
    try:
        if request.method == 'GET':
            warehouses = Warehouse.query.all()
            return jsonify([w.to_dict() for w in warehouses])
        data = request.json
        if not data or not data.get('name'):
            return jsonify({'error': 'Name required'}), 400
        warehouse = Warehouse(
            name=data['name'],
            short_code=data.get('short_code'),  # NEW
            location=data.get('location', ''),  # CHANGED: address -> location
            is_default=data.get('is_default', False)
        )
        db.session.add(warehouse)
        db.session.commit()
        return jsonify(warehouse.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/warehouses/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
@require_manager_role
def warehouse_detail(id):
    try:
        wh = Warehouse.query.get_or_404(id)
        if request.method == 'GET':
            return jsonify(wh.to_dict())
        if request.method == 'PUT':
            data = request.json
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            wh.name = data.get('name', wh.name)
            wh.short_code = data.get('short_code', wh.short_code)  # NEW
            wh.location = data.get('location', wh.location)  # CHANGED: address -> location
            wh.is_default = data.get('is_default', wh.is_default)
            db.session.commit()
            return jsonify(wh.to_dict())
        if request.method == 'DELETE':
            if wh.stock_quants:
                return jsonify({'error': 'Cannot delete warehouse with stock'}), 400
            db.session.delete(wh)
            db.session.commit()
            return jsonify({'message': 'Warehouse deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/locations', methods=['GET', 'POST'])
@jwt_required()
def locations():
    try:
        if request.method == 'GET':
            locs = Location.query.all()
            return jsonify([l.to_dict() for l in locs])

        data = request.json
        if not data or 'name' not in data or 'warehouse_id' not in data:
            return jsonify({'error': 'name and warehouse_id required'}), 400

        # Validate warehouse exists
        warehouse = Warehouse.query.get(data['warehouse_id'])
        if not warehouse:
            return jsonify({'error': 'Warehouse not found'}), 404

        location = Location(
            name=data['name'],
            short_code=data.get('short_code'),
            warehouse_id=data['warehouse_id']
        )
        db.session.add(location)
        db.session.commit()          # THIS WAS MISSING → 500 ERROR
        return jsonify(location.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print("Location creation error:", str(e))  # Debug help
        return jsonify({'error': 'Server error'}), 500

@api.route('/locations/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
@require_manager_role
def location_detail(id):
    try:
        loc = Location.query.get_or_404(id)
        if request.method == 'GET':
            return jsonify(loc.to_dict())
        if request.method == 'PUT':
            data = request.json
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            loc.name = data.get('name', loc.name)
            loc.short_code = data.get('short_code', loc.short_code)
            loc.warehouse_id = data.get('warehouse_id', loc.warehouse_id)
            db.session.commit()
            return jsonify(loc.to_dict())
        if request.method == 'DELETE':
            db.session.delete(loc)
            db.session.commit()
            return jsonify({'message': 'Location deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 3. Categories (unchanged)
@api.route('/categories', methods=['GET', 'POST'])
@jwt_required()
def categories():
    try:
        if request.method == 'GET':
            cats = Category.query.all()
            return jsonify([c.to_dict() for c in cats])
        data = request.json
        if not data or not data.get('name'):
            return jsonify({'error': 'Name required'}), 400
        if Category.query.filter_by(name=data['name']).first():
            return jsonify({'error': 'Category exists'}), 400
        cat = Category(name=data['name'])
        db.session.add(cat)
        db.session.commit()
        return jsonify(cat.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 4. Products (unchanged - already shows on_hand and category)
@api.route('/products', methods=['GET', 'POST'])
@jwt_required()
def products():
    try:
        if request.method == 'GET':
            q = request.args.get('q', '').strip()
            query = Product.query
            if q:
                query = query.filter((Product.name.ilike(f'%{q}%')) | (Product.sku.ilike(f'%{q}%')))
            products = query.all()
            result = []
            for p in products:
                total_stock = db.session.query(db.func.coalesce(db.func.sum(StockQuant.quantity), 0)).filter_by(product_id=p.id).scalar()
                category_name = p.category.name if p.category else "Uncategorized"
                result.append({
                    "id": p.id,
                    "sku": p.sku,
                    "name": p.name,
                    "category": category_name,
                    "cost": float(p.cost or 0),
                    "on_hand": float(total_stock or 0),
                    "unit_of_measure": p.unit_of_measure or "pcs",
                    "reorder_min": p.reorder_min or 0,
                    "sales_price": float(p.sales_price or 0)
                })
            return jsonify(result)
        data = request.json
        if not data or not all(k in data for k in ['name', 'sku']):
            return jsonify({'error': 'Name and SKU required'}), 400
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'error': 'SKU exists'}), 400
        product = Product(
            name=data['name'],
            sku=data['sku'],
            category_id=data.get('category_id'),
            unit_of_measure=data.get('unit_of_measure', 'pcs'),
            reorder_min=data.get('reorder_min', 0),
            cost=data.get('cost', 0.0),
            sales_price=data.get('sales_price', 0.0)
        )
        db.session.add(product)
        db.session.commit()
        initial_stock = data.get('initial_stock', {})
        for wh_id, qty in initial_stock.items():
            if qty > 0:
                quant = StockQuant(product_id=product.id, warehouse_id=int(wh_id), quantity=float(qty))
                db.session.add(quant)
        db.session.commit()
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def product_detail(id):
    try:
        p = Product.query.get_or_404(id)
        if request.method == 'GET':
            total_stock = db.session.query(db.func.coalesce(db.func.sum(StockQuant.quantity), 0)).filter_by(product_id=p.id).scalar()
            category_name = p.category.name if p.category else "Uncategorized"
            return jsonify({
                "id": p.id,
                "sku": p.sku,
                "name": p.name,
                "category": category_name,
                "cost": float(p.cost),
                "sales_price": float(p.sales_price or 0),
                "on_hand": float(total_stock),
                "unit_of_measure": p.unit_of_measure or "pcs",
                "reorder_min": p.reorder_min or 0,
                "stock_by_location": {sq.warehouse.name: float(sq.quantity) for sq in p.stock_quants}
            })
        if request.method == 'PUT':
            data = request.json
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            p.name = data.get('name', p.name)
            p.sku = data.get('sku', p.sku)
            p.category_id = data.get('category_id', p.category_id)
            p.unit_of_measure = data.get('unit_of_measure', p.unit_of_measure)
            p.reorder_min = data.get('reorder_min', p.reorder_min)
            p.cost = data.get('cost', p.cost)
            p.sales_price = data.get('sales_price', p.sales_price)
            db.session.commit()
            return jsonify(p.to_dict())
        if request.method == 'DELETE':
            if any(sq.quantity > 0 for sq in p.stock_quants):
                return jsonify({'error': 'Cannot delete product with stock'}), 400
            db.session.delete(p)
            db.session.commit()
            return jsonify({'message': 'Product deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/products/<int:id>/stock', methods=['GET'])
@jwt_required()
def product_stock(id):
    try:
        p = Product.query.get_or_404(id)
        stock = {sq.warehouse.name: float(sq.quantity) for sq in p.stock_quants}
        return jsonify({'product_id': id, 'stock_by_location': stock})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 5. Stock Quants / KPIs (unchanged)
@api.route('/stock-quants', methods=['GET'])
@jwt_required()
def stock_quants():
    try:
        quants = StockQuant.query.all()
        return jsonify([q.to_dict() for q in quants])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/stock-quants/low-stock', methods=['GET'])
@jwt_required()
def low_stock():
    try:
        low = []
        for p in Product.query.all():
            for sq in p.stock_quants:
                if sq.quantity < p.reorder_min and sq.quantity > 0:
                    low.append({
                        'product_id': p.id,
                        'product_name': p.name,
                        'warehouse_id': sq.warehouse_id,
                        'quantity': sq.quantity,
                        'reorder_min': p.reorder_min
                    })
        return jsonify(low)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/stock-quants/out-of-stock', methods=['GET'])
@jwt_required()
def out_of_stock():
    try:
        out = []
        for p in Product.query.all():
            if all(sq.quantity == 0 for sq in p.stock_quants):
                out.append({
                    'product_id': p.id,
                    'product_name': p.name,
                    'sku': p.sku
                })
        return jsonify(out)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 6. Receipts — UPDATED: responsible_id (default current user), is_late, vendor as receive_from
@api.route('/receipts', methods=['GET', 'POST'])
@jwt_required()
def receipts():
    try:
        now = datetime.utcnow()
        if request.method == 'GET':
            status = request.args.get('status')
            warehouse_id = request.args.get('warehouse_id', type=int)
            query = Receipt.query
            if status:
                query = query.filter(Receipt.status == status)
            if warehouse_id:
                query = query.filter(Receipt.warehouse_id == warehouse_id)
            receipts = query.order_by(Receipt.created_at.desc()).all()
            result = []
            for r in receipts:
                is_late = r.status in ['draft', 'ready'] and r.scheduled_date and r.scheduled_date < now  # NEW: Late flag
                result.append({**r.to_dict(), 'is_late': is_late})
            return jsonify(result)
        data = request.json
        if not data or not all(k in data for k in ['vendor', 'warehouse_id', 'lines']):
            return jsonify({'error': 'Vendor, warehouse_id, and lines required'}), 400
        user_id = get_jwt_identity()  # NEW: Default responsible
        ref = generate_reference(Receipt, 'WH/IN')
        scheduled_date = data.get('scheduled_date')
        if scheduled_date:
            scheduled_date = datetime.fromisoformat(scheduled_date)
        receipt = Receipt(
            reference=ref,
            vendor=data['vendor'],  # UI: receive_from
            warehouse_id=data['warehouse_id'],
            responsible_id=user_id,  # NEW
            scheduled_date=scheduled_date
        )
        db.session.add(receipt)
        db.session.flush()
        for line_data in data['lines']:
            line_data['receipt_id'] = receipt.id
            db.session.add(ReceiptLine(**line_data))
        db.session.commit()
        return jsonify(receipt.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/receipts/<int:id>', methods=['GET', 'PUT'])
@jwt_required()
def receipt_detail(id):
    try:
        now = datetime.utcnow()
        r = Receipt.query.get_or_404(id)
        if request.method == 'GET':
            is_late = r.status in ['draft', 'ready'] and r.scheduled_date and r.scheduled_date < now
            return jsonify({**r.to_dict(), 'is_late': is_late})
        if request.method == 'PUT':
            if r.status != 'draft':
                return jsonify({'error': 'Can only edit draft receipts'}), 400
            data = request.json
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            r.vendor = data.get('vendor', r.vendor)
            if 'scheduled_date' in data:
                r.scheduled_date = datetime.fromisoformat(data['scheduled_date']) if data['scheduled_date'] else None
            if 'responsible_id' in data:
                r.responsible_id = data.get('responsible_id')
            if 'lines' in data:
                replace_lines(ReceiptLine, r.id, data['lines'])
            db.session.commit()
            return jsonify(r.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/receipts/<int:id>/validate', methods=['POST'])
@jwt_required()
def validate_receipt(id):
    try:
        r = Receipt.query.get_or_404(id)
        if r.status != 'draft':
            return jsonify({'error': 'Receipt must be draft to validate'}), 400
        for line in r.receipt_lines:
            if line.done_qty > line.demand_qty:  # NEW: Prevent over-receipt
                return jsonify({'error': f'Done qty cannot exceed demand for product {line.product_id}'}), 400
            if line.done_qty > 0:
                update_stock(line.product_id, r.warehouse_id, line.done_qty, 'receipt', r.reference)
        r.status = 'done'
        r.validated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Receipt validated, stock updated'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/receipts/<int:id>/cancel', methods=['POST'])
@jwt_required()
def cancel_receipt(id):
    try:
        r = Receipt.query.get_or_404(id)
        if r.status == 'done':
            return jsonify({'error': 'Cannot cancel done receipt'}), 400
        r.status = 'canceled'
        db.session.commit()
        return jsonify({'message': 'Receipt canceled'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 7. Deliveries — UPDATED: delivery_address, responsible_id, operation_type (fixed), is_late, stock status
@api.route('/deliveries', methods=['GET', 'POST'])
@jwt_required()
def deliveries():
    try:
        now = datetime.utcnow()
        if request.method == 'GET':
            status = request.args.get('status')
            warehouse_id = request.args.get('warehouse_id', type=int)
            query = Delivery.query
            if status:
                query = query.filter(Delivery.status == status)
            if warehouse_id:
                query = query.filter(Delivery.warehouse_id == warehouse_id)
            deliveries = query.order_by(Delivery.created_at.desc()).all()
            result = []
            for d in deliveries:
                is_late = d.status in ['draft', 'ready'] and d.scheduled_date and d.scheduled_date < now
                result.append({**d.to_dict(), 'is_late': is_late})
            return jsonify(result)
        data = request.json
        if not data or not all(k in data for k in ['delivery_address', 'warehouse_id', 'lines']):
            return jsonify({'error': 'Delivery address, warehouse_id, and lines required'}), 400
        user_id = get_jwt_identity()
        ref = generate_reference(Delivery, 'WH/OUT')
        scheduled_date = data.get('scheduled_date')
        if scheduled_date:
            scheduled_date = datetime.fromisoformat(scheduled_date)
        delivery = Delivery(
            reference=ref,
            delivery_address=data['delivery_address'],  # CHANGED: customer -> delivery_address
            warehouse_id=data['warehouse_id'],
            responsible_id=user_id,  # NEW
            scheduled_date=scheduled_date
        )
        db.session.add(delivery)
        db.session.flush()
        for line_data in data['lines']:
            line_data['delivery_id'] = delivery.id
            db.session.add(DeliveryLine(**line_data))
        db.session.commit()
        return jsonify(delivery.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/deliveries/<int:id>', methods=['GET', 'PUT'])
@jwt_required()
def delivery_detail(id):
    try:
        now = datetime.utcnow()
        d = Delivery.query.get_or_404(id)
        if request.method == 'GET':
            is_late = d.status in ['draft', 'ready'] and d.scheduled_date and d.scheduled_date < now
            # NEW: Add stock status per line
            enhanced_lines = []
            for line in d.delivery_lines:
                quant = StockQuant.query.filter_by(product_id=line.product_id, warehouse_id=d.warehouse_id).first()
                stock_status = 'In Stock' if (quant and quant.quantity >= line.demand_qty) else 'Low Stock'
                enhanced_lines.append({**line.to_dict(), 'stock_status': stock_status})
            return jsonify({**d.to_dict(), 'lines': enhanced_lines, 'is_late': is_late})
        if request.method == 'PUT':
            if d.status != 'draft':
                return jsonify({'error': 'Can only edit draft deliveries'}), 400
            data = request.json
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            d.delivery_address = data.get('delivery_address', d.delivery_address)
            if 'scheduled_date' in data:
                d.scheduled_date = datetime.fromisoformat(data['scheduled_date']) if data['scheduled_date'] else None
            if 'responsible_id' in data:
                d.responsible_id = data.get('responsible_id')
            if 'lines' in data:
                replace_lines(DeliveryLine, d.id, data['lines'])
            db.session.commit()
            return jsonify(d.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/deliveries/<int:id>/check-availability', methods=['POST'])
@jwt_required()
def check_availability(id):
    try:
        d = Delivery.query.get_or_404(id)
        available = True
        issues = []

        # FIX 1: Use correct relationship name → delivery_lines (not lines)
        for line in d.delivery_lines:  # ← WAS d.lines or d.line → empty!
            quant = StockQuant.query.filter_by(
                product_id=line.product_id,
                warehouse_id=d.warehouse_id
            ).first_or_404()  # ← Safer than .first()

            current_qty = quant.quantity if quant else 0

            if current_qty < line.demand_qty:
                available = False
                issues.append({
                    'product_id': line.product_id,
                    'product_name': line.product.name,
                    'needed': float(line.demand_qty),
                    'available': float(current_qty)
                })

        # FIX 2: Always return 'available' as boolean (was sometimes missing)
        return jsonify({
            'available': available,
            'issues': issues
        })

    except Exception as e:
        # Optional: log the error
        print("Check availability error:", str(e))
        return jsonify({'error': 'Server error'}), 500

@api.route('/deliveries/<int:id>/mark-ready', methods=['POST'])
@jwt_required()
def mark_ready(id):
    try:
        d = Delivery.query.get_or_404(id)
        if d.status != 'draft':
            return jsonify({'error': 'Can only mark draft as ready'}), 400
        d.status = 'ready'
        db.session.commit()
        return jsonify({'message': 'Delivery marked as ready'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/deliveries/<int:id>/validate', methods=['POST'])
@jwt_required()
def validate_delivery(id):
    try:
        d = Delivery.query.get_or_404(id)
        if d.status != 'ready':
            return jsonify({'error': 'Delivery must be ready to validate'}), 400
        
        # Manual stock check
        for line in d.delivery_lines:
            quant = StockQuant.query.filter_by(product_id=line.product_id, warehouse_id=d.warehouse_id).first()
            current_qty = quant.quantity if quant else 0
            if current_qty < line.done_qty:
                return jsonify({'error': f'Insufficient stock for product {line.product_id} (needed {line.done_qty}, available {current_qty})'}), 400
            if line.done_qty > line.demand_qty:  # NEW: Prevent over-delivery
                return jsonify({'error': f'Done qty cannot exceed demand for product {line.product_id}'}), 400
        
        for line in d.delivery_lines:
            if line.done_qty > 0:
                update_stock(line.product_id, d.warehouse_id, -line.done_qty, 'delivery', d.reference)
        d.status = 'done'
        d.validated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Delivery validated, stock updated'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/deliveries/<int:id>/cancel', methods=['POST'])
@jwt_required()
def cancel_delivery(id):
    try:
        d = Delivery.query.get_or_404(id)
        if d.status == 'done':
            return jsonify({'error': 'Cannot cancel done delivery'}), 400
        d.status = 'canceled'
        db.session.commit()
        return jsonify({'message': 'Delivery canceled'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 8. Transfers (unchanged)
@api.route('/transfers', methods=['GET', 'POST'])
@jwt_required()
def transfers():
    try:
        if request.method == 'GET':
            status = request.args.get('status')
            query = Transfer.query
            if status:
                query = query.filter(Transfer.status == status)
            transfers = query.order_by(Transfer.created_at.desc()).all()
            return jsonify([t.to_dict() for t in transfers])
        data = request.json
        if not data or not all(k in data for k in ['from_warehouse_id', 'to_warehouse_id', 'lines']):
            return jsonify({'error': 'From warehouse, to warehouse, and lines required'}), 400
        ref = generate_reference(Transfer, 'WH/TR')
        transfer = Transfer(
            reference=ref,
            from_warehouse_id=data['from_warehouse_id'],
            to_warehouse_id=data['to_warehouse_id']
        )
        db.session.add(transfer)
        db.session.flush()
        for line_data in data['lines']:
            line_data['transfer_id'] = transfer.id
            db.session.add(TransferLine(**line_data))
        db.session.commit()
        return jsonify(transfer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/transfers/<int:id>/validate', methods=['POST'])
@jwt_required()
def validate_transfer(id):
    try:
        t = Transfer.query.get_or_404(id)
        if t.status != 'draft':
            return jsonify({'error': 'Transfer must be draft to validate'}), 400
        
        # Check source stock
        for line in t.transfer_lines:
            quant = StockQuant.query.filter_by(product_id=line.product_id, warehouse_id=t.from_warehouse_id).first()
            current_qty = quant.quantity if quant else 0
            if current_qty < line.quantity:
                return jsonify({'error': f'Insufficient stock for product {line.product_id} (needed {line.quantity}, available {current_qty})'}), 400
        
        # Move stock
        for line in t.transfer_lines:
            update_stock(line.product_id, t.from_warehouse_id, -line.quantity, 'transfer', t.reference)
            update_stock(line.product_id, t.to_warehouse_id, line.quantity, 'transfer', t.reference)
        
        t.status = 'done'
        t.validated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Transfer validated, stock moved'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 9. Adjustments (unchanged, but fixed double-count)
@api.route('/adjustments', methods=['GET', 'POST'])  # NEW: Added GET
@jwt_required()
def adjustments():
    try:
        if request.method == 'GET':
            adjs = Adjustment.query.order_by(Adjustment.created_at.desc()).all()
            return jsonify([a.to_dict() for a in adjs])
        data = request.json
        if not data or not all(k in data for k in ['warehouse_id', 'lines']):
            return jsonify({'error': 'Warehouse ID and lines required'}), 400
        ref = generate_reference(Adjustment, 'WH/ADJ')
        adjustment = Adjustment(
            reference=ref,
            warehouse_id=data['warehouse_id'],
            reason=data.get('reason', 'Inventory Adjustment')
        )
        db.session.add(adjustment)
        db.session.flush()
        for line_data in data['lines']:
            product_id = line_data['product_id']
            counted_qty = float(line_data['counted_qty'])
            quant = StockQuant.query.filter_by(product_id=product_id, warehouse_id=data['warehouse_id']).first()
            previous_qty = quant.quantity if quant else 0.0
            diff = counted_qty - previous_qty
            al = AdjustmentLine(
                adjustment_id=adjustment.id,
                product_id=product_id,
                counted_qty=counted_qty,
                previous_qty=previous_qty,
                difference=diff
            )
            db.session.add(al)
            # FIXED: Only update if diff != 0, and set exact after
            if diff != 0:
                update_stock(product_id, data['warehouse_id'], diff, 'adjustment', ref)
            # FIXED: Set exact counted_qty AFTER update
            if quant:
                quant.quantity = counted_qty
            else:
                quant = StockQuant(product_id=product_id, warehouse_id=data['warehouse_id'], quantity=counted_qty)
                db.session.add(quant)
        db.session.commit()
        return jsonify(adjustment.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 10. Stock Moves — ENHANCED: Add contact, from/to names, type icon logic
@api.route('/stock-moves', methods=['GET'])
@jwt_required()
def stock_moves():
    try:
        product_id = request.args.get('product_id', type=int)
        query = StockMove.query.order_by(StockMove.created_at.desc())
        if product_id:
            query = query.filter_by(product_id=product_id)

        moves = query.limit(100).all()  # ← correct variable name

        result = []
        for move in moves:  # ← WAS "for m in moves" or "for l in locs" → bug!
            from_loc = move.from_location.name if move.from_location else 'Vendor'
            to_loc = move.to_location.name if move.to_location else 'Customer'
            contact = ''

            if move.move_type == 'receipt':
                receipt = Receipt.query.filter_by(reference=move.reference).first()
                if receipt:
                    contact = receipt.vendor
                    from_loc = 'Vendor'
                    to_loc = receipt.warehouse.name
            elif move.move_type == 'delivery':
                delivery = Delivery.query.filter_by(reference=move.reference).first()
                if delivery:
                    contact = delivery.delivery_address
                    from_loc = delivery.warehouse.name
                    to_loc = 'Customer'

            result.append({
                'id': move.id,
                'reference': move.reference or 'SYSTEM',
                'date': move.created_at.isoformat(),
                'contact': contact,
                'from': from_loc,
                'to': to_loc,
                'quantity': float(move.quantity),
                'move_type': move.move_type,
                'status': move.state or 'done'
            })

        return jsonify(result)

    except Exception as e:
        print("Stock moves error:", str(e))
        return jsonify({'error': str(e)}), 500

@api.route('/stock-moves/product/<int:product_id>', methods=['GET'])
@jwt_required()
def stock_moves_by_product(product_id):
    try:
        moves = StockMove.query.filter_by(product_id=product_id).order_by(StockMove.created_at.desc()).all()
        return jsonify([m.to_dict() for m in moves])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 11. Dashboard — UPDATED: Late counts, to_receive/to_deliver (pending), total operations
@api.route('/dashboard/summary', methods=['GET'])
@jwt_required()
def dashboard_summary():
    try:
        now = datetime.utcnow()
        total_products = Product.query.count()
        total_stock_value = db.session.query(db.func.coalesce(db.func.sum(StockQuant.quantity * Product.cost), 0))\
            .join(Product, StockQuant.product_id == Product.id).scalar() or 0.0
        low_count = db.session.query(db.func.count(Product.id.distinct()))\
            .join(StockQuant).filter(StockQuant.quantity < Product.reorder_min).scalar() or 0
        out_count = Product.query.filter(
            ~db.exists().where((StockQuant.product_id == Product.id) & (StockQuant.quantity > 0))
        ).count()
        
        # Receipts: to_receive (draft+ready), late (scheduled < now and not done)
        pending_receipts = Receipt.query.filter(Receipt.status.in_(['draft', 'ready'])).count()
        late_receipts = Receipt.query.filter(
            Receipt.status.in_(['draft', 'ready']),
            Receipt.scheduled_date < now,
            Receipt.scheduled_date.isnot(None)
        ).count()
        total_receipt_ops = Receipt.query.count()
        
        # Deliveries: similar
        pending_deliveries = Delivery.query.filter(Delivery.status.in_(['draft', 'ready'])).count()
        late_deliveries = Delivery.query.filter(
            Delivery.status.in_(['draft', 'ready']),
            Delivery.scheduled_date < now,
            Delivery.scheduled_date.isnot(None)
        ).count()
        total_delivery_ops = Delivery.query.count()
        
        pending_transfers = Transfer.query.filter(Transfer.status == 'draft').count()
        
        return jsonify({
            'totalProducts': total_products,
            'totalStockValue': round(float(total_stock_value), 2),
            'lowStockCount': low_count,
            'outOfStockCount': out_count,
            # Receipts
            'receiptsToReceive': pending_receipts,
            'lateReceipts': late_receipts,
            'totalReceiptOperations': total_receipt_ops,
            # Deliveries
            'deliveriesToDeliver': pending_deliveries,
            'lateDeliveries': late_deliveries,
            'totalDeliveryOperations': total_delivery_ops,
            'pendingTransfers': pending_transfers
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def init_routes(app):
    app.register_blueprint(api, url_prefix='/api')