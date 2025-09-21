# Backend - E-Commerce Portal API

FastAPI-based REST API for the E-Commerce Portal application.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Server**
   ```bash
   python start.py
   ```
   
   Or manually:
   ```bash
   python main.py
   ```

3. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Redoc: http://localhost:8000/redoc

## 📊 Database Schema

### Tables

**customers**
- `id` (INTEGER, PRIMARY KEY)
- `name` (STRING)
- `email` (STRING, UNIQUE)
- `created_at` (DATETIME)

**orders**
- `id` (INTEGER, PRIMARY KEY)
- `customer_id` (INTEGER, FOREIGN KEY → customers.id)
- `total_cost` (FLOAT)
- `created_at` (DATETIME)

**order_items**
- `id` (INTEGER, PRIMARY KEY)
- `order_id` (INTEGER, FOREIGN KEY → orders.id)
- `item_name` (STRING)
- `unit_price` (FLOAT)
- `quantity` (INTEGER)

## 🔌 API Endpoints

### Customer Endpoints

#### `POST /customers/`
Create a new customer.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T12:00:00"
}
```

#### `GET /customers/`
List all customers.

**Query Parameters:**
- `skip` (int): Number of records to skip (default: 0)
- `limit` (int): Maximum number of records to return (default: 100)

#### `GET /customers/{customer_id}`
Get customer details including orders.

### Order Endpoints

#### `POST /orders/`
Create a new order.

**Request Body:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "item_name": "Product A",
      "unit_price": 29.99,
      "quantity": 2
    },
    {
      "item_name": "Product B",
      "unit_price": 15.50,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "customer_id": 1,
  "total_cost": 75.48,
  "created_at": "2024-01-01T12:00:00",
  "customer": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "items": [...]
}
```

#### `GET /orders/`
List all orders.

#### `GET /orders/{order_id}`
Get order details.

## 🛠️ Development

### Running with Auto-Reload
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Database Management

**Reset Database:**
```bash
rm ecommerce.db
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

**Direct Database Access:**
```bash
sqlite3 ecommerce.db
```

### Environment Variables

Create a `.env` file:
```env
DATABASE_URL=sqlite:///./ecommerce.db
```

## 🧪 Testing API

### Using curl

**Create Customer:**
```bash
curl -X POST "http://localhost:8000/customers/" \
     -H "Content-Type: application/json" \
     -d '{"name": "Test User", "email": "test@example.com"}'
```

**Create Order:**
```bash
curl -X POST "http://localhost:8000/orders/" \
     -H "Content-Type: application/json" \
     -d '{
       "customer_id": 1,
       "items": [
         {"item_name": "Test Product", "unit_price": 10.00, "quantity": 1}
       ]
     }'
```

### Using the Interactive Docs

Visit http://localhost:8000/docs for a full interactive API documentation interface.

## 📁 File Structure

```
backend/
├── main.py          # FastAPI application and routes
├── database.py      # SQLAlchemy models and database setup
├── schemas.py       # Pydantic schemas for request/response validation
├── start.py         # Startup script with dependency installation
├── requirements.txt # Python package dependencies
└── ecommerce.db    # SQLite database (auto-generated)
```

## 🔧 Configuration

### CORS Settings
The API is configured to accept requests from `http://localhost:3000` (React dev server). To modify:

```python
# In main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Configuration
Currently uses SQLite for local development. For production, modify the `SQLALCHEMY_DATABASE_URL` in `database.py`.

## 🐛 Common Issues

1. **Import Errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
2. **Database Locked**: Close any open database connections or delete `ecommerce.db`
3. **Port in Use**: Change port with `uvicorn main:app --port 8001`

---

Built with ❤️ using FastAPI and SQLAlchemy
