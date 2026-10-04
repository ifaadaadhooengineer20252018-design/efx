from pydantic import BaseModel
from typing import Optional, List


# =========================
# PRODUCT
# =========================

class ProductCreate(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price: Optional[str] = None
    quantity: Optional[str] = None
    unit: Optional[str] = None
    location: Optional[str] = None
    status: str


# =========================
# USER REGISTRATION
# =========================

class UserCreate(BaseModel):
    full_name: str
    phone: str
    email: str
    password: str


# =========================
# USER RESPONSE
# =========================

class UserResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    email: str
    role: str

    class Config:
        from_attributes = True


# =========================
# USER LOGIN
# =========================

class UserLogin(BaseModel):
    email: str
    password: str


# =========================
# LOGIN RESPONSE
# =========================

class Token(BaseModel):
    access_token: str
    token_type: str


# =========================
# ORDER ITEM
# =========================

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: str


# =========================
# CREATE ORDER
# =========================

class OrderCreate(BaseModel):
    delivery_address: str
    items: List[OrderItemCreate]
# =========================
# DELIVERY CREATE
# =========================

class DeliveryCreate(BaseModel):
    order_id: int
    driver_id: int
    pickup_location: Optional[str] = None
    delivery_location: Optional[str] = None
class DeliveryStatusUpdate(BaseModel):
    status: str
# =========================
# ORDER ITEM RESPONSE
# =========================

class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: str
    unit_price: str
    sub_total: str

    class Config:
        from_attributes = True


# =========================
# ORDER RESPONSE
# =========================

class OrderResponse(BaseModel):
    id: int
    status: str
    total_amount: str
    delivery_address: Optional[str] = None
    buyer_id: int

    class Config:
        from_attributes = True

        # =========================
# REVIEW
# =========================

class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: Optional[str] = None