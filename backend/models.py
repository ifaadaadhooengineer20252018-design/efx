from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, Text, Boolean, Integer
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(150))
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)


class Category(Base):
    __tablename__ = "categories"

    id = Column(BigInteger, primary_key=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False)



class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, nullable=False)
    farmer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    category_id = Column(BigInteger, ForeignKey("categories.id"), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    price = Column(String(50))
    quantity = Column(String(50))
    unit = Column(String(50))
    location = Column(String(150))
    status = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(BigInteger, primary_key=True, nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)



class Order(Base):
    __tablename__ = "orders"

    id = Column(BigInteger, primary_key=True, nullable=False)
    status = Column(String(30), nullable=False)
    total_amount = Column(String(50), nullable=False)
    delivery_address = Column(String(255))
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)
    buyer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(BigInteger, primary_key=True, nullable=False)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)
    quantity = Column(String(50), nullable=False)
    unit_price = Column(String(50), nullable=False)
    sub_total = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(BigInteger, primary_key=True, nullable=False)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    amount = Column(String(50), nullable=False)
    method = Column(String(50), nullable=False)
    transaction_reference = Column(String(150))
    status = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)


class Revenue(Base):
    __tablename__ = "revenues"

    id = Column(BigInteger, primary_key=True, index=True)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    revenue_type = Column(String(50), nullable=False)
    amount = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(BigInteger, primary_key=True, nullable=False)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    driver_id = Column(BigInteger, ForeignKey("drivers.id"), nullable=False)
    pickup_location = Column(String(255))
    delivery_location = Column(String(255))
    status = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    delivered_at = Column(DateTime(timezone=True))



class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(BigInteger, primary_key=True, index=True)
    buyer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    farmer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    license_number = Column(String, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(BigInteger, primary_key=True, index=True)
    conversation_id = Column(
        BigInteger,
        ForeignKey("conversations.id"),
        nullable=False
    )
    sender_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(BigInteger, primary_key=True, index=True)
    buyer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(BigInteger, primary_key=True, index=True)
    driver_id = Column(BigInteger, ForeignKey("drivers.id"), nullable=False)
    vehicle_type = Column(String, nullable=False)
    plate_number = Column(String, nullable=False)
    capacity = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)





