import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function OrderList({ orders, setOrders, refresh }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders/`);
      setOrders(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [setOrders]);

  useEffect(() => {
    fetchOrders();
  }, [refresh, fetchOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders with customer information, items, and totals.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8-4-8 4m16 0v18l-8 4-8-4V7m16 18l-8 4-8-4m16-18L12 3 4 7v18l8 4 8-4 8 4 8-4V7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="hover:bg-gray-50">
                <div className="px-4 py-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            #{order.id}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          {order.customer && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {order.customer.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-green-600">
                        ${order.total_cost.toFixed(2)}
                      </span>
                      <svg
                        className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${
                          expandedOrder === order.id ? 'transform rotate-180' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      {order.customer && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Customer Information</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Name:</strong> {order.customer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Email:</strong> {order.customer.email}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={item.id || index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                                  <p className="text-xs text-gray-500">
                                    ${item.unit_price.toFixed(2)} × {item.quantity}
                                  </p>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  ${(item.unit_price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">Total:</span>
                                <span className="text-lg font-bold text-green-600">
                                  ${order.total_cost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No items found for this order</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-6 bg-gray-50 px-4 py-3 text-sm text-gray-500 rounded-md">
          <div className="flex justify-between items-center">
            <span>Showing {orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            <span>
              Total Value: <span className="font-medium text-gray-900">
                ${orders.reduce((sum, order) => sum + order.total_cost, 0).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;
