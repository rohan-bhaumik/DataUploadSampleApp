from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import database
import schemas

app = FastAPI(
    title="E-Commerce Portal API",
    description="Local e-commerce data collection API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "E-Commerce Portal API is running!"}


@app.post("/customers/", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(database.get_db)):
    # Check if customer already exists
    db_customer = db.query(database.Customer).filter(database.Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(
            status_code=400,
            detail="Customer with this email already exists"
        )
    
    db_customer = database.Customer(name=customer.name, email=customer.email)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


@app.get("/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    customers = db.query(database.Customer).offset(skip).limit(limit).all()
    return customers


@app.get("/customers/{customer_id}", response_model=schemas.CustomerWithOrders)
def read_customer(customer_id: int, db: Session = Depends(database.get_db)):
    customer = db.query(database.Customer).filter(database.Customer.id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    # Verify customer exists
    customer = db.query(database.Customer).filter(database.Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Calculate total cost
    total_cost = sum(item.unit_price * item.quantity for item in order.items)
    
    # Create order
    db_order = database.Order(customer_id=order.customer_id, total_cost=total_cost)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_item = database.OrderItem(
            order_id=db_order.id,
            item_name=item.item_name,
            unit_price=item.unit_price,
            quantity=item.quantity
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order


@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    orders = db.query(database.Order).offset(skip).limit(limit).all()
    return orders


@app.get("/orders/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(database.get_db)):
    order = db.query(database.Order).filter(database.Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
