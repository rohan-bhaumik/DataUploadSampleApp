import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import OrderForm from './components/OrderForm';
import CustomerList from './components/CustomerList';
import OrderList from './components/OrderList';
import DemoNotice from './components/DemoNotice';
import './App.css';

// Check if we're running on GitHub Pages
const isGitHubPages = window.location.hostname === 'rohan-bhaumik.github.io';

function App() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  const tabs = [
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'add-customer', name: 'Add Customer', icon: '➕' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'add-order', name: 'Create Order', icon: '🛒' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900">🛍️ E-Commerce Portal</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <span className="text-sm text-gray-500">Local Data Collection System</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🟢 Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Show demo notice on GitHub Pages */}
          {isGitHubPages && <DemoNotice />}
          {activeTab === 'customers' && (
            <CustomerList customers={customers} setCustomers={setCustomers} refresh={refresh} />
          )}
          {activeTab === 'add-customer' && (
            <CustomerForm onSuccess={triggerRefresh} />
          )}
          {activeTab === 'orders' && (
            <OrderList orders={orders} setOrders={setOrders} refresh={refresh} />
          )}
          {activeTab === 'add-order' && (
            <OrderForm customers={customers} onSuccess={triggerRefresh} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
