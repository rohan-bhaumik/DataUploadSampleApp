# E-Commerce Portal - Local Data Upload Sample App

A full-stack web application for collecting e-commerce data locally, designed for eventual integration with Fivetran's connector SDK.

## 🏗️ Architecture

- **Frontend**: React 18 with Tailwind CSS
- **Backend**: Python FastAPI with SQLite database
- **Database**: Local SQLite for data persistence
- **Integration Ready**: Designed for Fivetran connector SDK

## 📊 Data Schema

The application captures the following information:

### Customers
- Customer Name
- Email Address
- Registration Timestamp

### Orders
- Customer ID (foreign key)
- Order Date/Time
- Total Cost in USD (auto-calculated)

### Order Items
- Item Name
- Unit Price
- Quantity per Order
- Order ID (foreign key)

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the API server:
   ```bash
   python start.py
   ```
   
   Or manually:
   ```bash
   python main.py
   ```

The backend will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at: http://localhost:3000

## 🎯 Features

### Customer Management
- ➕ Add new customers with name and email
- 📋 View all customers in a responsive list
- 🔍 Automatic email validation and duplicate prevention

### Order Management
- 🛒 Create orders with multiple items
- 📦 Variable quantities and unit prices
- 💰 Automatic total cost calculation
- 📋 Comprehensive order history with expandable details
- 👤 Customer information linked to each order

### User Interface
- 📱 Fully responsive design
- 🎨 Modern, clean interface with Tailwind CSS
- ⚡ Real-time form validation
- 🔄 Auto-refresh capabilities
- 📊 Order summaries and totals

## 📁 Project Structure

```
DataUploadSampleApp/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database models and setup
│   ├── schemas.py           # Pydantic models
│   ├── start.py             # Startup script
│   ├── requirements.txt     # Python dependencies
│   └── ecommerce.db        # SQLite database (generated)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerForm.js
│   │   │   ├── CustomerList.js
│   │   │   ├── OrderForm.js
│   │   │   └── OrderList.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Customers
- `GET /customers/` - List all customers
- `POST /customers/` - Create new customer
- `GET /customers/{id}` - Get customer details with orders

### Orders
- `GET /orders/` - List all orders
- `POST /orders/` - Create new order
- `GET /orders/{id}` - Get order details

### Utility
- `GET /` - API status
- `GET /health` - Health check

## 🗄️ Database Access

The SQLite database (`ecommerce.db`) is stored in the backend directory. You can:

1. **Direct SQL Access**:
   ```bash
   sqlite3 backend/ecommerce.db
   ```

2. **Python Script Access**:
   ```python
   from backend.database import SessionLocal, Customer, Order, OrderItem
   
   db = SessionLocal()
   customers = db.query(Customer).all()
   ```

## 🔄 Fivetran Integration

This application is designed for easy integration with Fivetran's connector SDK:

### Data Export Format
The SQLite database contains normalized tables ready for ETL processes:

- **customers**: Core customer data
- **orders**: Order headers with totals
- **order_items**: Individual line items

### Integration Steps
1. Use Fivetran's connector SDK to connect to the SQLite database
2. Configure data sync schedules
3. Map tables to your data warehouse schema
4. Set up incremental sync using the `created_at` timestamps

## 🛠️ Development

### Running in Development Mode

Both frontend and backend support hot-reload for development:

**Backend** (auto-reloads on file changes):
```bash
cd backend
uvicorn main:app --reload
```

**Frontend** (auto-reloads on file changes):
```bash
cd frontend
npm start
```

### Environment Configuration

Create a `.env` file in the backend directory for custom settings:
```env
DATABASE_URL=sqlite:///./ecommerce.db
API_HOST=0.0.0.0
API_PORT=8000
```

## 📝 Usage Examples

### Adding a Customer
```bash
curl -X POST "http://localhost:8000/customers/" \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Creating an Order
```bash
curl -X POST "http://localhost:8000/orders/" \
     -H "Content-Type: application/json" \
     -d '{
       "customer_id": 1,
       "items": [
         {"item_name": "Widget A", "unit_price": 29.99, "quantity": 2},
         {"item_name": "Widget B", "unit_price": 15.50, "quantity": 1}
       ]
     }'
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `start.py` or use `uvicorn main:app --port 8001`
   - Frontend: Set `PORT=3001` environment variable

2. **CORS Issues**
   - Ensure frontend runs on `http://localhost:3000`
   - Check CORS settings in `main.py`

3. **Database Errors**
   - Delete `ecommerce.db` to reset database
   - Check file permissions in backend directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -am 'Add some feature'`
6. Push: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Ready for GitHub and Fivetran integration!** 🚀
