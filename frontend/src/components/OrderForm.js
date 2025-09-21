import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function OrderForm({ customers, onSuccess }) {
  const [customersList, setCustomersList] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ item_name: '', unit_price: '', quantity: 1 }]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/`);
      setCustomersList(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'unit_price' ? parseFloat(value) || '' : 
               field === 'quantity' ? parseInt(value) || 1 : value
    };
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_name: '', unit_price: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: updatedItems
      });
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const price = parseFloat(item.unit_price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const orderData = {
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map(item => ({
          item_name: item.item_name,
          unit_price: parseFloat(item.unit_price),
          quantity: parseInt(item.quantity)
        }))
      };

      const response = await axios.post(`${API_BASE_URL}/orders/`, orderData);
      setMessage({ 
        type: 'success', 
        text: `Order #${response.data.id} created successfully! Total: $${response.data.total_cost.toFixed(2)}` 
      });
      setFormData({
        customer_id: '',
        items: [{ item_name: '', unit_price: '', quantity: 1 }]
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create order';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Order</h2>
      
      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
            Select Customer *
          </label>
          <select
            id="customer_id"
            name="customer_id"
            required
            value={formData.customer_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a customer...</option>
            {customersList.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
          {customersList.length === 0 && (
            <p className="mt-2 text-sm text-yellow-600">
              ⚠️ No customers found. Please add a customer first.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Order Items *
            </label>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ➕ Add Item
            </button>
          </div>
          
          {formData.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Item #{index + 1}</h4>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Product name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="1"
                  />
                </div>
              </div>
              
              {item.unit_price && item.quantity && (
                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">
                    Subtotal: <span className="font-medium text-gray-900">
                      ${((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Order Total:</span>
            <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || customersList.length === 0}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
}

export default OrderForm;
