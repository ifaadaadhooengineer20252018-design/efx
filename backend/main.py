from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
import models
import schemas
import security


app = FastAPI(title="EFX API")


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# CREATE DATABASE TABLES
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# DATABASE SESSION
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================
# JWT SECURITY
# =========================

security_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = security.verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID in token"
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


# =========================
# AUTHORIZATION
# =========================

def require_role(*allowed_roles):

    def role_checker(
        current_user: models.User = Depends(get_current_user)
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to perform this action"
            )

        return current_user

    return role_checker


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "EFX Ethiopia Farm Exchange API is running!"
    }


# =========================
# DATABASE TEST
# =========================

@app.get("/db-test")
def db_test():

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    current_database(),
                    current_user,
                    (SELECT COUNT(*) FROM products)
            """)
        ).fetchone()

    return {
        "database": result[0],
        "user": result[1],
        "product_count": result[2]
    }
# =========================
# USER REGISTRATION
# =========================

@app.post(
    "/register",
    response_model=schemas.UserResponse
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    existing_email = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_phone = db.query(models.User).filter(
        models.User.phone == user.phone
    ).first()

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone already registered"
        )

    hashed_password = security.hash_password(
        user.password
    )

    # New public registrations are farmers by default.
    # Admin role cannot be assigned through registration.
    new_user = models.User(
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        password_hash=hashed_password,
        role="farmer",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================
# USER LOGIN
# =========================

@app.post(
    "/login",
    response_model=schemas.Token
)
def login_user(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = security.verify_password(
        user.password,
        existing_user.password_hash
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = security.create_access_token(
        data={
            "sub": str(existing_user.id),
            "role": existing_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================
# CURRENT USER
# =========================

@app.get(
    "/me",
    response_model=schemas.UserResponse
)
def get_me(
    current_user: models.User = Depends(get_current_user)
):
    return current_user


# =========================
# PRODUCTS
# =========================

@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(models.Product).all()


# =========================
# MY PRODUCTS
# =========================

@app.get("/my-products")
def get_my_products(
    current_user: models.User = Depends(
        require_role("farmer")
    ),
    db: Session = Depends(get_db)
):

    products = db.query(models.Product).filter(
        models.Product.farmer_id == current_user.id
    ).all()

    return products


# =========================
# CREATE PRODUCT
# =========================

@app.post("/products")
def create_product(
    product: schemas.ProductCreate,
    current_user: models.User = Depends(
        require_role("farmer")
    ),
    db: Session = Depends(get_db)
):

    new_product = models.Product(
        farmer_id=current_user.id,
        category_id=product.category_id,
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        unit=product.unit,
        location=product.location,
        status=product.status,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# =========================
# GET ONE PRODUCT
# =========================

@app.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# =========================
# UPDATE PRODUCT
# =========================

@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: schemas.ProductCreate,
    current_user: models.User = Depends(
        require_role("farmer")
    ),
    db: Session = Depends(get_db)
):

    existing_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not existing_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if existing_product.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own products"
        )

    existing_product.category_id = product.category_id
    existing_product.name = product.name
    existing_product.description = product.description
    existing_product.price = product.price
    existing_product.quantity = product.quantity
    existing_product.unit = product.unit
    existing_product.location = product.location
    existing_product.status = product.status
    existing_product.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(existing_product)

    return existing_product


# =========================
# DELETE PRODUCT
# =========================

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: models.User = Depends(
        require_role("farmer")
    ),
    db: Session = Depends(get_db)
):

    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own products"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully",
        "product_id": product_id
    }


# =========================
# CREATE ORDER
# =========================

@app.post("/orders")
def create_order(
    order: schemas.OrderCreate,
    current_user: models.User = Depends(
        require_role("buyer")
    ),
    db: Session = Depends(get_db)
):

    if not order.items:
        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one product"
        )

    total_amount = 0.0
    order_items_data = []

    for item in order.items:

        product = db.query(models.Product).filter(
            models.Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        try:
            quantity = float(item.quantity)
            unit_price = float(product.price)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid price or quantity for product {item.product_id}"
            )

        if quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero"
            )

        subtotal = quantity * unit_price
        total_amount += subtotal

        order_items_data.append({
            "product_id": product.id,
            "quantity": str(quantity),
            "unit_price": str(unit_price),
            "sub_total": str(subtotal)
        })

    new_order = models.Order(
        status="pending",
        total_amount=str(total_amount),
        delivery_address=order.delivery_address,
        buyer_id=current_user.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_order)
    db.flush()

    for item_data in order_items_data:

        new_order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            sub_total=item_data["sub_total"],
            created_at=datetime.utcnow()
        )

        db.add(new_order_item)

    db.commit()
    db.refresh(new_order)

    return {
        "message": "Order created successfully",
        "order_id": new_order.id,
        "status": new_order.status,
        "total_amount": new_order.total_amount,
        "delivery_address": new_order.delivery_address,
        "buyer_id": new_order.buyer_id
    }


# =========================
# GET MY ORDERS
# =========================

@app.get("/orders")
def get_my_orders(
    current_user: models.User = Depends(
        require_role("buyer")
    ),
    db: Session = Depends(get_db)
):

    orders = (
        db.query(models.Order)
        .filter(
            models.Order.buyer_id == current_user.id
        )
        .order_by(models.Order.id.desc())
        .all()
    )

    result = []

    for order in orders:

        items = (
            db.query(models.OrderItem)
            .filter(
                models.OrderItem.order_id == order.id
            )
            .all()
        )

        result.append({
            "id": order.id,
            "status": order.status,
            "total_amount": order.total_amount,
            "delivery_address": order.delivery_address,
            "buyer_id": order.buyer_id,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "items": [
                {
                    "id": item.id,
                    "order_id": item.order_id,
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "sub_total": item.sub_total,
                    "created_at": item.created_at
                }
                for item in items
            ]
        })

    return result


# =========================
# CREATE PAYMENT
# =========================

@app.post("/payments")
def create_payment(
    payment_data: dict,
    current_user: models.User = Depends(
        require_role("buyer")
    ),
    db: Session = Depends(get_db)
):

    order_id = payment_data.get("order_id")

    if not order_id:
        raise HTTPException(
            status_code=400,
            detail="order_id is required"
        )

    order = db.query(models.Order).filter(
        models.Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.buyer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only pay for your own orders"
        )

    required_fields = [
        "amount",
        "method",
        "transaction_reference"
    ]

    for field in required_fields:
        if field not in payment_data:
            raise HTTPException(
                status_code=400,
                detail=f"{field} is required"
            )

    # =========================
    # CREATE PAYMENT
    # =========================

    payment = models.Payment(
        order_id=payment_data["order_id"],
        amount=payment_data["amount"],
        method=payment_data["method"],
        transaction_reference=payment_data["transaction_reference"],
        status="paid",
        created_at=datetime.utcnow()
    )

    db.add(payment)
    db.flush()

    # =========================
    # EFX REVENUE CALCULATION
    # =========================

    try:
        order_amount = float(order.total_amount)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="Invalid order total amount"
        )

    # Farmer transaction fee = 1%
    farmer_commission = order_amount * 0.01

    # Buyer service fee = 1%
    buyer_service_fee = order_amount * 0.01

    # =========================
    # FARMER COMMISSION
    # =========================

    existing_farmer_revenue = db.query(
        models.Revenue
    ).filter(
        models.Revenue.order_id == order.id,
        models.Revenue.revenue_type == "farmer_commission"
    ).first()

    if not existing_farmer_revenue:

        farmer_revenue = models.Revenue(
            order_id=order.id,
            revenue_type="farmer_commission",
            amount=str(round(farmer_commission, 2)),
            status="earned",
            created_at=datetime.utcnow()
        )

        db.add(farmer_revenue)

    # =========================
    # BUYER SERVICE FEE
    # =========================

    existing_buyer_revenue = db.query(
        models.Revenue
    ).filter(
        models.Revenue.order_id == order.id,
        models.Revenue.revenue_type == "buyer_service_fee"
    ).first()

    if not existing_buyer_revenue:

        buyer_revenue = models.Revenue(
            order_id=order.id,
            revenue_type="buyer_service_fee",
            amount=str(round(buyer_service_fee, 2)),
            status="earned",
            created_at=datetime.utcnow()
        )

        db.add(buyer_revenue)

    # =========================
    # SAVE PAYMENT + REVENUE
    # =========================

    db.commit()
    db.refresh(payment)

    return {
        "message": "Payment successful",

        "payment_id": payment.id,

        "order_id": payment.order_id,

        "amount": payment.amount,

        "method": payment.method,

        "transaction_reference": payment.transaction_reference,

        "status": payment.status,

        "revenue": {
            "farmer_commission_1_percent": round(
                farmer_commission, 2
            ),
            "buyer_service_fee_1_percent": round(
                buyer_service_fee, 2
            ),
            "total_efx_revenue": round(
                farmer_commission + buyer_service_fee,
                2
            )
        }
    }

    
# =========================
# CREATE DELIVERY
# =========================

@app.post("/deliveries")
def create_delivery(
    delivery_data: schemas.DeliveryCreate,
    current_user: models.User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    order = db.query(models.Order).filter(
        models.Order.id == delivery_data.order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    delivery = models.Delivery(
        order_id=delivery_data.order_id,
        driver_id=delivery_data.driver_id,
        pickup_location=delivery_data.pickup_location,
        delivery_location=delivery_data.delivery_location,
        status="pending",
        created_at=datetime.utcnow()
    )

    db.add(delivery)
    db.commit()
    db.refresh(delivery)

    return {
        "message": "Delivery created successfully",
        "delivery_id": delivery.id,
        "order_id": delivery.order_id,
        "driver_id": delivery.driver_id,
        "pickup_location": delivery.pickup_location,
        "delivery_location": delivery.delivery_location,
        "status": delivery.status
    }


# =========================
# UPDATE DELIVERY STATUS
# =========================

@app.put("/deliveries/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int,
    status_data: schemas.DeliveryStatusUpdate,
    current_user: models.User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    allowed_statuses = [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered"
    ]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {allowed_statuses}"
        )

    delivery = db.query(models.Delivery).filter(
        models.Delivery.id == delivery_id
    ).first()

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found"
        )

    delivery.status = status_data.status

    if status_data.status == "delivered":
        delivery.delivered_at = datetime.utcnow()

    db.commit()
    db.refresh(delivery)

    return {
        "message": "Delivery status updated successfully",
        "delivery_id": delivery.id,
        "order_id": delivery.order_id,
        "driver_id": delivery.driver_id,
        "status": delivery.status,
        "delivered_at": delivery.delivered_at
    }


# =========================
# GET DELIVERY BY ORDER
# =========================

@app.get("/deliveries/order/{order_id}")
def get_delivery_by_order(
    order_id: int,
    current_user: models.User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    delivery = db.query(models.Delivery).filter(
        models.Delivery.order_id == order_id
    ).first()

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found for this order"
        )

    return {
        "delivery_id": delivery.id,
        "order_id": delivery.order_id,
        "driver_id": delivery.driver_id,
        "pickup_location": delivery.pickup_location,
        "delivery_location": delivery.delivery_location,
        "status": delivery.status,
        "created_at": delivery.created_at,
        "delivered_at": delivery.delivered_at
    }


# =========================
# GET DELIVERY BY ID
# =========================

@app.get("/deliveries/{delivery_id}")
def get_delivery(
    delivery_id: int,
    current_user: models.User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    delivery = db.query(models.Delivery).filter(
        models.Delivery.id == delivery_id
    ).first()

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found"
        )

    return {
        "delivery_id": delivery.id,
        "order_id": delivery.order_id,
        "driver_id": delivery.driver_id,
        "pickup_location": delivery.pickup_location,
        "delivery_location": delivery.delivery_location,
        "status": delivery.status,
        "created_at": delivery.created_at,
        "delivered_at": delivery.delivered_at
    }


# =========================
# GET AVAILABLE DRIVERS
# =========================

@app.get("/drivers/available")
def get_available_drivers(
    current_user: models.User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    drivers = db.query(models.Driver).filter(
        models.Driver.is_available == True
    ).all()

    return [
        {
            "driver_id": driver.id,
            "user_id": driver.user_id,
            "license_number": driver.license_number,
            "is_available": driver.is_available
        }
        for driver in drivers
    ]


# =========================
# CREATE REVIEW
# =========================

@app.post("/reviews")
def create_review(
    review_data: schemas.ReviewCreate,
    current_user: models.User = Depends(
        require_role("buyer")
    ),
    db: Session = Depends(get_db)
):

    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    product = db.query(models.Product).filter(
        models.Product.id == review_data.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    review = models.Review(
        buyer_id=current_user.id,
        product_id=review_data.product_id,
        rating=review_data.rating,
        comment=review_data.comment,
        created_at=datetime.utcnow()
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "message": "Review created successfully",
        "review_id": review.id,
        "buyer_id": review.buyer_id,
        "product_id": review.product_id,
        "rating": review.rating,
        "comment": review.comment
    }


# =========================
# GET PRODUCT REVIEWS
# =========================

@app.get("/products/{product_id}/reviews")
def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):

    reviews = db.query(models.Review).filter(
        models.Review.product_id == product_id
    ).all()

    return [
        {
            "review_id": review.id,
            "buyer_id": review.buyer_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at
        }
        for review in reviews
    ]


# ============================================================
# ADMIN AUTHORIZATION
# ============================================================

def require_admin(
    current_user: models.User = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


# ============================================================
# ADMIN DASHBOARD - USERS
# ============================================================

@app.get("/admin/users")
def admin_get_users(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    users = db.query(models.User).order_by(
        models.User.id.desc()
    ).all()

    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "phone": user.phone,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        for user in users
    ]


# ============================================================
# ADMIN DASHBOARD - PRODUCTS
# ============================================================

@app.get("/admin/products")
def admin_get_products(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    products = db.query(models.Product).order_by(
        models.Product.id.desc()
    ).all()

    return [
        {
            "id": product.id,
            "farmer_id": product.farmer_id,
            "category_id": product.category_id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "quantity": product.quantity,
            "unit": product.unit,
            "location": product.location,
            "status": product.status,
            "created_at": product.created_at,
            "updated_at": product.updated_at
        }
        for product in products
    ]


# ============================================================
# ADMIN DASHBOARD - ORDERS
# ============================================================

@app.get("/admin/orders")
def admin_get_orders(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    orders = db.query(models.Order).order_by(
        models.Order.id.desc()
    ).all()

    result = []

    for order in orders:

        items = db.query(models.OrderItem).filter(
            models.OrderItem.order_id == order.id
        ).all()

        result.append({
            "id": order.id,
            "buyer_id": order.buyer_id,
            "status": order.status,
            "total_amount": order.total_amount,
            "delivery_address": order.delivery_address,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "sub_total": item.sub_total,
                    "created_at": item.created_at
                }
                for item in items
            ]
        })

    return result


# ============================================================
# ADMIN DASHBOARD - DELIVERIES
# ============================================================

@app.get("/admin/deliveries")
def admin_get_deliveries(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    deliveries = db.query(models.Delivery).order_by(
        models.Delivery.id.desc()
    ).all()

    return [
        {
            "delivery_id": delivery.id,
            "order_id": delivery.order_id,
            "driver_id": delivery.driver_id,
            "pickup_location": delivery.pickup_location,
            "delivery_location": delivery.delivery_location,
            "status": delivery.status,
            "created_at": delivery.created_at,
            "delivered_at": delivery.delivered_at
        }
        for delivery in deliveries
    ]


# ============================================================
# ADMIN DASHBOARD - PAYMENTS
# ============================================================

@app.get("/admin/payments")
def admin_get_payments(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    payments = db.query(models.Payment).order_by(
        models.Payment.id.desc()
    ).all()

    return [
        {
            "payment_id": payment.id,
            "order_id": payment.order_id,
            "amount": payment.amount,
            "method": payment.method,
            "transaction_reference": payment.transaction_reference,
            "status": payment.status,
            "created_at": payment.created_at
        }
        for payment in payments
    ]


# ============================================================
# ADMIN DASHBOARD - REVIEWS
# ============================================================

@app.get("/admin/reviews")
def admin_get_reviews(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    reviews = db.query(models.Review).order_by(
        models.Review.id.desc()
    ).all()

    return [
        {
            "review_id": review.id,
            "buyer_id": review.buyer_id,
            "product_id": review.product_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at
        }
        for review in reviews
    ]


# ============================================================
# ADMIN DASHBOARD - STATISTICS
# ============================================================

@app.get("/admin/stats")
def admin_get_stats(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    total_users = db.query(models.User).count()

    total_farmers = db.query(models.User).filter(
        models.User.role == "farmer"
    ).count()

    total_buyers = db.query(models.User).filter(
        models.User.role == "buyer"
    ).count()

    total_admins = db.query(models.User).filter(
        models.User.role == "admin"
    ).count()

    total_products = db.query(models.Product).count()

    total_orders = db.query(models.Order).count()

    total_deliveries = db.query(models.Delivery).count()

    total_payments = db.query(models.Payment).count()

    total_reviews = db.query(models.Review).count()

    available_drivers = db.query(models.Driver).filter(
        models.Driver.is_available == True
    ).count()

    revenues = db.query(models.Revenue).all()

    total_revenue = sum(
        float(revenue.amount)
        for revenue in revenues
        if revenue.status == "earned"
    )

    return {
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_buyers": total_buyers,
        "total_admins": total_admins,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_deliveries": total_deliveries,
        "total_payments": total_payments,
        "total_reviews": total_reviews,
        "available_drivers": available_drivers,
        "total_revenue": total_revenue
    }

    # ============================================================
# ADMIN DASHBOARD - REVENUES
# ============================================================

@app.get("/admin/revenues")
def admin_get_revenues(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):

    revenues = db.query(models.Revenue).order_by(
        models.Revenue.id.desc()
    ).all()

    return [
        {
            "id": revenue.id,
            "order_id": revenue.order_id,
            "revenue_type": revenue.revenue_type,
            "amount": revenue.amount,
            "status": revenue.status,
            "created_at": revenue.created_at
        }
        for revenue in revenues
    ]