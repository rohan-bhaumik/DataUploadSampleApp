from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class OrderItemBase(BaseModel):
    item_name: str
    unit_price: float
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    name: str
    email: str


class CustomerCreate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderCreate(OrderBase):
    pass


class Order(BaseModel):
    id: int
    customer_id: int
    total_cost: float
    created_at: datetime
    customer: Optional[Customer] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True


class CustomerWithOrders(Customer):
    orders: List[Order] = []
