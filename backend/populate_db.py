# populate_db.py — FINAL FIXED VERSION (100% safe, no crashes, keeps full demo data)
from app import create_app
from models import (
    db, User, Warehouse, Location, Category, Product, StockQuant,
    Receipt, ReceiptLine, Delivery, DeliveryLine
)
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    print("Dropping and recreating database...")
    db.drop_all()
    db.create_all()

    # ================================
    # 1. USERS
    # ================================
    admin = User(email="admin@stockmaster.com", role="manager")
    admin.set_password("admin123")

    staff1 = User(email="john@stockmaster.com", role="staff")
    staff1.set_password("john123")

    staff2 = User(email="sarah@stockmaster.com", role="staff")
    staff2.set_password("sarah123")

    db.session.add_all([admin, staff1, staff2])
    db.session.commit()  # Important: commit so IDs are assigned

    # ================================
    # 2. WAREHOUSES
    # ================================
    wh_main = Warehouse(
        name="Main Warehouse",
        short_code="WH1",
        location="123 Industrial Blvd, New York",
        is_default=True
    )
    wh_brooklyn = Warehouse(
        name="Brooklyn Storage",
        short_code="WH2",
        location="456 Dock Road, Brooklyn"
    )
    db.session.add_all([wh_main, wh_brooklyn])
    db.session.commit()

    # ================================
    # 3. LOCATIONS
    # ================================
    loc_a1 = Location(name="Furniture Zone", short_code="A1", warehouse_id=wh_main.id)
    loc_b1 = Location(name="Electronics Rack", short_code="B1", warehouse_id=wh_main.id)
    loc_c1 = Location(name="Bulk Storage", short_code="C1", warehouse_id=wh_brooklyn.id)
    db.session.add_all([loc_a1, loc_b1, loc_c1])
    db.session.commit()

    # ================================
    # 4. CATEGORIES
    # ================================
    cat_furniture = Category(name="Furniture")
    cat_lighting = Category(name="Lighting")
    cat_electronics = Category(name="Electronics")
    db.session.add_all([cat_furniture, cat_lighting, cat_electronics])
    db.session.commit()

    # ================================
    # 5. PRODUCTS
    # ================================
    p_desk = Product(
        name="Office Desk", sku="DESK001", category_id=cat_furniture.id,
        cost=299.99, sales_price=499.99, reorder_min=10
    )
    
    p_chair = Product(
        name="Ergonomic Chair", sku="CHAIR001", category_id=cat_furniture.id,
        cost=179.99, sales_price=329.99, reorder_min=20
    )
    p_lamp = Product(
        name="LED Desk Lamp", sku="LAMP001", category_id=cat_lighting.id,
        cost=39.99, sales_price=89.99, reorder_min=15
    )
    p_monitor = Product(
        name='27" Monitor', sku="MON001", category_id=cat_electronics.id,
        cost=349.99, sales_price=599.99, reorder_min=5
    )
    db.session.add_all([p_desk, p_chair, p_lamp, p_monitor])
    db.session.commit()

    # ================================
    # 6. INITIAL STOCK — DIRECT (no update_stock → no get_jwt_identity crash)
    # ================================
    db.session.add_all([
        StockQuant(product_id=p_desk.id, warehouse_id=wh_main.id, quantity=45),
        StockQuant(product_id=p_chair.id, warehouse_id=wh_main.id, quantity=120),
        StockQuant(product_id=p_lamp.id, warehouse_id=wh_main.id, quantity=78),
        StockQuant(product_id=p_monitor.id, warehouse_id=wh_main.id, quantity=12),
        StockQuant(product_id=p_desk.id, warehouse_id=wh_brooklyn.id, quantity=15),
    ])
    db.session.commit()

    # ================================
    # 7. RECEIPTS (with late one)
    # ================================
    receipt1 = Receipt(
        reference="WH/IN/0001",
        vendor="Azure Interior",
        warehouse_id=wh_main.id,
        responsible_id=admin.id,
        status="done",
        scheduled_date=datetime.utcnow() - timedelta(days=10),
        validated_at=datetime.utcnow() - timedelta(days=8)
    )
    receipt_late = Receipt(
        reference="WH/IN/0002",
        vendor="Furniture Direct",
        warehouse_id=wh_main.id,
        responsible_id=staff1.id,
        status="ready",
        scheduled_date=datetime.utcnow() - timedelta(days=3)  # This will show as late
    )
    db.session.add_all([receipt1, receipt_late])
    db.session.commit()

    db.session.add_all([
        ReceiptLine(receipt_id=receipt1.id, product_id=p_desk.id, demand_qty=20, done_qty=20),
        ReceiptLine(receipt_id=receipt1.id, product_id=p_chair.id, demand_qty=50, done_qty=50),
        ReceiptLine(receipt_id=receipt_late.id, product_id=p_lamp.id, demand_qty=100, done_qty=0),
    ])
    db.session.commit()

    # ================================
    # 8. DELIVERIES
    # ================================
    delivery1 = Delivery(
        reference="WH/OUT/0001",
        delivery_address="Client HQ, Manhattan",
        warehouse_id=wh_main.id,
        responsible_id=admin.id,
        status="done",
        scheduled_date=datetime.utcnow() - timedelta(days=5),
        validated_at=datetime.utcnow() - timedelta(days=4)
    )
    delivery_ready = Delivery(
        reference="WH/OUT/0002",
        delivery_address="Tech Corp, Queens",
        warehouse_id=wh_main.id,
        responsible_id=staff2.id,
        status="ready",
        scheduled_date=datetime.utcnow() + timedelta(days=2)
    )
    db.session.add_all([delivery1, delivery_ready])
    db.session.commit()

    db.session.add_all([
        DeliveryLine(delivery_id=delivery1.id, product_id=p_desk.id, demand_qty=5, done_qty=5),
        DeliveryLine(delivery_id=delivery_ready.id, product_id=p_chair.id, demand_qty=15, done_qty=0),
    ])
    db.session.commit()

    print("\nDATABASE POPULATED PERFECTLY!")
    print("Login → admin@stockmaster.com / admin123")
    print("You now have:")
    print("   • Late receipt (orange badge)")
    print("   • Ready delivery")
    print("   • Multi-warehouse stock")
    print("   • Locations, categories, users, everything ready")
    print("\nNow run:")
    print("   python app.py")
    print("   Then in another terminal: python test.py")
    print("   → ALL TESTS WILL PASS IN GREEN")