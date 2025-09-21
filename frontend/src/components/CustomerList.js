import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function CustomerList({ customers, setCustomers, refresh }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [refresh]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/customers/`);
      setCustomers(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all customers in the system including their name, email, and registration date.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={fetchCustomers}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {customers.length === 0 ? (
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
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new customer.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {customer.name}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-900">ID: {customer.id}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(customer.created_at)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {customers.length > 0 && (
        <div className="mt-6 bg-gray-50 px-4 py-3 text-sm text-gray-500 rounded-md">
          Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default CustomerList;
