import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Navigate based on role
        if (userData.role === 'restaurant') {
          setCurrentPage('restaurant-dashboard');
        } else if (userData.role === 'family') {
          setCurrentPage('family-dashboard');
        } else if (userData.role === 'admin') {
          setCurrentPage('admin-dashboard');
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    }
  };

  const handleAuth = async (endpoint, data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', result.access_token);
        setUser(result.user);
        
        // Navigate based on role
        if (result.user.role === 'restaurant') {
          setCurrentPage('restaurant-dashboard');
        } else if (result.user.role === 'family') {
          setCurrentPage('family-dashboard');
        } else if (result.user.role === 'admin') {
          setCurrentPage('admin-dashboard');
        }
      } else {
        setError(result.detail || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('login');
  };

  const LoginForm = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAuth('login', formData);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🛡️ AllerSafe</h1>
            <p className="text-lg text-gray-600">Safe dining for everyone</p>
          </div>
          
          <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentPage('register')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            <div className="text-center text-sm text-gray-500 mb-4">Demo Accounts:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => handleAuth('login', { email: 'restaurant@demo.com', password: 'demo123' })}
                className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200"
              >
                🏪 Restaurant Demo
              </button>
              <button
                onClick={() => handleAuth('login', { email: 'family@demo.com', password: 'demo123' })}
                className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200"
              >
                👨‍👩‍👧‍👦 Family Demo
              </button>
              <button
                onClick={() => handleAuth('login', { email: 'admin@demo.com', password: 'demo123' })}
                className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
              >
                ⚙️ Admin Demo
              </button>
              <button
                onClick={() => handleAuth('login', { email: 'consumer@demo.com', password: 'demo123' })}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200"
              >
                🆓 Free Consumer
              </button>
              <button
                onClick={() => handleAuth('login', { email: 'premium@demo.com', password: 'demo123' })}
                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200"
              >
                ⭐ Premium Consumer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RegisterForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      role: 'family'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAuth('register', formData);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🛡️ Join AllerSafe</h1>
            <p className="text-lg text-gray-600">Create your account</p>
          </div>
          
          <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="family">👨‍👩‍👧‍👦 Family Account</option>
                  <option value="restaurant">🏪 Restaurant Owner</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Simple Loading Component
  const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );

  // Simple Dashboard Template
  const Dashboard = ({ title, role, children }) => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🛡️ AllerSafe {title}</h1>
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );

  // Restaurant Dashboard
  const RestaurantDashboard = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);
    const [showMenuScraper, setShowMenuScraper] = useState(false);
    const [showBilling, setShowBilling] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [paymentTransactions, setPaymentTransactions] = useState([]);

    useEffect(() => {
      fetchRestaurantData();
      checkPaymentStatus();
    }, []);

    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const restaurantResponse = await fetch(`${API_BASE_URL}/api/restaurants/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          setRestaurant(restaurantData);
          
          if (restaurantData) {
            const menuResponse = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantData.id}/menu-items`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (menuResponse.ok) {
              const menuData = await menuResponse.json();
              setMenuItems(menuData);
            }
          }
        } else {
          setShowCreateRestaurant(true);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    const checkPaymentStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const paymentStatus = urlParams.get('payment');
      
      if (sessionId && paymentStatus === 'success') {
        pollPaymentStatus(sessionId);
      }
    };

    const pollPaymentStatus = async (sessionId, attempts = 0) => {
      const maxAttempts = 5;
      const pollInterval = 2000;

      if (attempts >= maxAttempts) {
        alert('Payment status check timed out. Please check your billing section.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/payments/status/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.payment_status === 'paid') {
            alert('Payment successful! Your subscription is now active.');
            // Refresh user data
            const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
            }
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          } else if (data.status === 'expired') {
            alert('Payment session expired. Please try again.');
            return;
          }

          // Continue polling
          setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const handleSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const originUrl = window.location.origin;
        
        const response = await fetch(`${API_BASE_URL}/api/payments/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            package_id: 'restaurant_monthly',
            origin_url: originUrl
          })
        });

        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          const error = await response.json();
          alert(`Payment error: ${error.detail}`);
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    };

    const createRestaurant = async (restaurantData) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(restaurantData)
        });
        
        if (response.ok) {
          setShowCreateRestaurant(false);
          fetchRestaurantData();
        }
      } catch (error) {
        console.error('Error creating restaurant:', error);
      }
    };

    const generateQRCode = async () => {
      if (!restaurant) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurant.id}/qr-code`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const qrData = await response.json();
          setQrCode(qrData);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    const publishMenu = async () => {
      if (!restaurant) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurant.id}/publish-menu`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          fetchRestaurantData();
          alert('Menu published successfully!');
        }
      } catch (error) {
        console.error('Error publishing menu:', error);
      }
    };

    if (showCreateRestaurant) {
      return <CreateRestaurantForm onSubmit={createRestaurant} onCancel={() => setShowCreateRestaurant(false)} />;
    }

    if (showMenuScraper && restaurant) {
      return <MenuScraper restaurantId={restaurant.id} onClose={() => { setShowMenuScraper(false); fetchRestaurantData(); }} />;
    }

    if (showBilling) {
      return <BillingDashboard onBack={() => setShowBilling(false)} />;
    }

    if (!restaurant) {
      return <LoadingSpinner message="Loading restaurant data..." />;
    }

    return (
      <Dashboard title="Restaurant" role="restaurant">
        {/* Subscription Warning */}
        {restaurant.subscription_warning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span>⚠️ {restaurant.subscription_warning}</span>
              <button
                onClick={handleSubscription}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium ml-4"
              >
                Subscribe Now ($99/mo + $299 setup)
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'menu', 'qr-code', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Overview</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{restaurant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">{restaurant.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Subscription Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user?.subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.subscription_status === 'active' ? '✅ Active' : '⏳ Trial'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Menu Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.menu_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {restaurant.menu_published ? '✅ Published' : '⏳ Draft'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Menu Items</p>
                    <p className="text-gray-900">{menuItems.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowMenuScraper(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    📥 Import Menu from URL
                  </button>
                  <button
                    onClick={publishMenu}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    📋 Publish Menu
                  </button>
                  <button
                    onClick={generateQRCode}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    📱 Generate QR Code
                  </button>
                  {user?.subscription_status !== 'active' && (
                    <button
                      onClick={handleSubscription}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium"
                    >
                      💳 Subscribe Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Tab - Same as before */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">📋 Menu Items</h2>
              <div className="space-x-4">
                <button
                  onClick={() => setShowMenuScraper(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Import from URL
                </button>
                <button
                  onClick={publishMenu}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Publish Menu
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {menuItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No menu items yet. Import from URL to get started!</p>
                  <button
                    onClick={() => setShowMenuScraper(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    📥 Import Menu
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 p-6">
                  {menuItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Ingredients:</p>
                            <p className="text-sm text-gray-700">{item.ingredients.slice(0, 3).join(', ')}{item.ingredients.length > 3 && '...'}</p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.allergens_detected.map((allergen) => (
                              <span
                                key={allergen}
                                className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                              >
                                ⚠️ {allergen}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          {item.price && <p className="text-sm font-medium text-gray-900">${item.price}</p>}
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR Code Tab - Same as before */}
        {activeTab === 'qr-code' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📱 QR Code for Menu</h2>
              
              {!qrCode ? (
                <button
                  onClick={generateQRCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Generate QR Code
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <img
                      src={`data:image/png;base64,${qrCode.qr_code}`}
                      alt="Restaurant QR Code"
                      className="border rounded-lg shadow-sm max-w-sm"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Menu URL:</p>
                    <p className="text-sm font-mono bg-gray-100 px-3 py-2 rounded break-all">{qrCode.menu_url}</p>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${qrCode.qr_code}`;
                        link.download = `${restaurant.name}-qr-code.png`;
                        link.click();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      📥 Download QR Code
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      🖨️ Print QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">💳 Billing & Subscription</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user?.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.subscription_status === 'active' ? 'Active' : 'Trial'}
                      </span>
                    </div>
                    {user?.subscription && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Package</p>
                          <p className="text-gray-900">{user.subscription.package_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Next Billing</p>
                          <p className="text-gray-900">
                            {new Date(user.subscription.next_billing_date).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Plan</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Monthly Fee</p>
                      <p className="text-2xl font-bold text-gray-900">$99</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Setup Fee</p>
                      <p className="text-lg font-semibold text-gray-900">$299 (one-time)</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Unlimited menu items</li>
                      <li>✅ QR code generation</li>
                      <li>✅ Allergen detection</li>
                      <li>✅ Analytics dashboard</li>
                    </ul>
                    {user?.subscription_status !== 'active' && (
                      <button
                        onClick={handleSubscription}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium mt-4"
                      >
                        Subscribe Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dashboard>
    );
  };

  // Consumer Menu Scanner Component (New Feature)
  const ConsumerMenuScanner = ({ onScanComplete, onAnalyzeSafety, onRequestSupport, onSaveMenu, scanResults, safetyResults, family, isPremium }) => {
    const [url, setUrl] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleScan = async () => {
      if (!url.trim()) {
        alert('Please enter a restaurant menu URL');
        return;
      }

      setIsLoading(true);
      const result = await onScanComplete(url.trim(), restaurantName.trim());
      setIsLoading(false);
    };

    const analyzeSafety = async (member) => {
      if (!scanResults || !member) return;
      setSelectedMember(member);
      await onAnalyzeSafety(scanResults.scan_id, member.allergies);
    };

    const renderSafetyResults = () => {
      if (!safetyResults) return null;

      return (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🛡️ Safety Analysis for {selectedMember?.name}
              <span className={`ml-2 px-2 py-1 rounded text-xs ${isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                {isPremium ? 'Premium Analysis' : 'Basic Analysis'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Safe Items */}
              <div>
                <h4 className="font-medium text-green-700 mb-3 flex items-center">
                  ✅ Likely Safe ({safetyResults.safe_count})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {safetyResults.safe_items.map((item, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      {item.price && (
                        <p className="text-sm font-medium text-gray-900 mt-1">${item.price}</p>
                      )}
                      {isPremium && (
                        <div className="mt-1">
                          <span className="text-xs text-green-600">
                            Confidence: {Math.round(item.confidence_score * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {safetyResults.safe_items.length === 0 && (
                    <p className="text-gray-500 text-sm">No items identified as safe</p>
                  )}
                </div>
              </div>

              {/* Unsafe Items */}
              <div>
                <h4 className="font-medium text-red-700 mb-3 flex items-center">
                  ❌ Contains Allergens ({safetyResults.unsafe_count})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {safetyResults.unsafe_items.map((item, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.matching_allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            ⚠️ {allergen}
                          </span>
                        ))}
                      </div>
                      {item.price && (
                        <p className="text-sm font-medium text-gray-900 mt-1">${item.price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Uncertain Items */}
            {safetyResults.uncertain_count > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-yellow-700 mb-3 flex items-center">
                  ⚠️ Uncertain - Limited Information ({safetyResults.uncertain_count})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {safetyResults.uncertain_items.map((item, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                      <p className="text-xs text-yellow-700">Verify with restaurant</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Upgrade Message */}
            {!isPremium && safetyResults.upgrade_message && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">💡 {safetyResults.upgrade_message}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                <strong>Important:</strong> {safetyResults.disclaimer}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onRequestSupport(scanResults.restaurant_name, scanResults.url || url)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Request Official Partnership
              </button>
              
              {isPremium && (
                <button
                  onClick={() => {
                    const menuName = prompt('Enter a name for this menu:', scanResults.restaurant_name);
                    if (menuName) {
                      onSaveMenu(scanResults.scan_id, menuName);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Save to Favorites
                </button>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🆓 Scan Any Restaurant Menu</h2>
          <p className="text-gray-600 mb-6">
            Paste any restaurant's menu URL to scan for allergens. Works with most restaurant websites.
          </p>

          {/* URL Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Menu URL</label>
              <input
                type="url"
                placeholder="https://restaurant-website.com/menu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name (Optional)</label>
              <input
                type="text"
                placeholder="Restaurant name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>

            <button
              onClick={handleScan}
              disabled={isLoading || !url.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '⏳ Scanning Menu...' : '🔍 Scan Menu'}
            </button>
          </div>

          {/* Sample URLs for Demo */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Try these sample restaurant URLs:</h4>
            <div className="space-y-2">
              <button
                onClick={() => setUrl('https://www.olivegarden.com/menus/dinner')}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Olive Garden Menu
              </button>
              <button
                onClick={() => setUrl('https://www.chilis.com/menu')}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Chili's Menu
              </button>
              <button
                onClick={() => setUrl('https://locations.panerabread.com/menu')}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Panera Bread Menu
              </button>
            </div>
          </div>
        </div>

        {/* Scan Results */}
        {scanResults && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{scanResults.restaurant_name}</h3>
                <p className="text-sm text-gray-500">{scanResults.total_items_found} menu items found</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded">
                <p className="text-xs text-yellow-800 font-medium">⚠️ Not Verified by Restaurant</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Disclaimer:</strong> This menu was scanned using public data and is not confirmed by the restaurant. 
                Always verify allergen information with restaurant staff before ordering.
              </p>
            </div>

            {/* Family Member Selection */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Check safety for family members:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {family.members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => analyzeSafety(member)}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${
                      selectedMember?.id === member.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.allergies.length === 0 ? (
                        <span className="text-xs text-gray-500">No allergies</span>
                      ) : (
                        member.allergies.slice(0, 3).map((allergen) => (
                          <span
                            key={allergen}
                            className="inline-flex px-1 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                          >
                            {allergen}
                          </span>
                        ))
                      )}
                      {member.allergies.length > 3 && (
                        <span className="text-xs text-gray-500">+{member.allergies.length - 3} more</span>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Click to analyze safety</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Menu Items Display (before analysis) */}
            {!safetyResults && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-900">Found Menu Items:</h4>
                {scanResults.menu_items.slice(0, 10).map((item, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        {item.detected_allergens?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.detected_allergens.map((allergen) => (
                              <span
                                key={allergen}
                                className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                              >
                                {allergen}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {item.price && (
                        <div className="ml-4 text-sm font-medium text-gray-900">
                          ${item.price}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {scanResults.menu_items.length > 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing 10 of {scanResults.menu_items.length} items. Select a family member above to see full safety analysis.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Safety Analysis Results */}
        {renderSafetyResults()}
      </div>
    );
  };
  const CreateRestaurantForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      address: '',
      phone: '',
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏪 Create Restaurant Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                <input
                  type="tel"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Create Restaurant
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Menu Scraper Component
  const MenuScraper = ({ restaurantId, onClose }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [scrapedItems, setScrapedItems] = useState([]);
    const [error, setError] = useState('');

    const handleScrape = async () => {
      if (!url) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/scrape-menu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ url })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setScrapedItems(result.items);
        } else {
          setError(result.detail || 'Failed to scrape menu');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      }
      
      setIsLoading(false);
    };

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📥 Import Menu from URL</h2>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex space-x-4">
                <input
                  type="url"
                  placeholder="Enter restaurant menu URL... (e.g., https://example-restaurant.com/menu)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  onClick={handleScrape}
                  disabled={isLoading || !url}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium"
                >
                  {isLoading ? '⏳ Scraping...' : '📥 Scrape Menu'}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  ❌ {error}
                </div>
              )}

              {scrapedItems.length > 0 && (
                <div>
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    ✅ Successfully scraped {scrapedItems.length} menu items! They are saved as drafts and ready for review.
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {scrapedItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Detected ingredients:</p>
                              <p className="text-sm text-gray-700">{item.ingredients.join(', ')}</p>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.allergens_detected.map((allergen) => (
                                <span
                                  key={allergen}
                                  className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                >
                                  ⚠️ {allergen}
                                </span>
                              ))}
                            </div>
                          </div>
                          {item.price && (
                            <div className="ml-4 text-sm font-medium text-gray-900">
                              ${item.price}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Family Dashboard Component with Consumer Features
  const FamilyDashboard = () => {
    const [family, setFamily] = useState(null);
    const [showCreateFamily, setShowCreateFamily] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showConsumerScanner, setShowConsumerScanner] = useState(false);
    const [scannedMenu, setScannedMenu] = useState(null);
    const [consumerScanResults, setConsumerScanResults] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [safetyResults, setSafetyResults] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [emergencyContact, setEmergencyContact] = useState({ name: '', phone_number: '' });
    const [showEmergencyForm, setShowEmergencyForm] = useState(false);
    const [location, setLocation] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [savedMenus, setSavedMenus] = useState([]);

    useEffect(() => {
      fetchFamilyData();
      checkPaymentStatus();
      getCurrentLocation();
      if (user?.role === 'family') {
        fetchScanHistory();
        if (user?.subscription_status === 'active') {
          fetchSavedMenus();
        }
      }
    }, []);

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log('Location access denied:', error);
          }
        );
      }
    };

    const fetchScanHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/consumer/scan-history?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setScanHistory(data);
        }
      } catch (error) {
        console.error('Error fetching scan history:', error);
      }
    };

    const fetchSavedMenus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/consumer/saved-menus`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSavedMenus(data);
        }
      } catch (error) {
        console.error('Error fetching saved menus:', error);
      }
    };

    const checkPaymentStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const paymentStatus = urlParams.get('payment');
      
      if (sessionId && paymentStatus === 'success') {
        pollPaymentStatus(sessionId);
      }
    };

    const pollPaymentStatus = async (sessionId, attempts = 0) => {
      const maxAttempts = 5;
      const pollInterval = 2000;

      if (attempts >= maxAttempts) {
        alert('Payment status check timed out. Please check your billing section.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/payments/status/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.payment_status === 'paid') {
            alert('Payment successful! Your subscription is now active.');
            // Refresh user data
            const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
            }
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          } else if (data.status === 'expired') {
            alert('Payment session expired. Please try again.');
            return;
          }

          // Continue polling
          setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const handleSubscription = async (packageId) => {
      try {
        const token = localStorage.getItem('token');
        const originUrl = window.location.origin;
        
        const response = await fetch(`${API_BASE_URL}/api/payments/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            package_id: packageId,
            origin_url: originUrl
          })
        });

        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          const error = await response.json();
          alert(`Payment error: ${error.detail}`);
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    };

    const fetchFamilyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/families/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const familyData = await response.json();
          setFamily(familyData);
          
          // Set emergency contact if exists
          if (familyData?.emergency_contact) {
            setEmergencyContact(familyData.emergency_contact);
          }
        } else {
          setShowCreateFamily(true);
        }
      } catch (error) {
        console.error('Error fetching family data:', error);
      }
    };

    const createFamily = async (familyData) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/families`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(familyData)
        });
        
        if (response.ok) {
          setShowCreateFamily(false);
          fetchFamilyData();
        }
      } catch (error) {
        console.error('Error creating family:', error);
      }
    };

    const setEmergencyContactInfo = async () => {
      if (!family || !emergencyContact.name || !emergencyContact.phone_number) {
        alert('Please fill in both name and phone number');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/families/${family.id}/emergency-contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(emergencyContact)
        });

        if (response.ok) {
          alert('Emergency contact updated successfully!');
          setShowEmergencyForm(false);
          fetchFamilyData();
        }
      } catch (error) {
        console.error('Error setting emergency contact:', error);
        alert('Failed to update emergency contact');
      }
    };

    const sendEmergencyAlert = async (member) => {
      if (user?.subscription_status !== 'active') {
        alert('Emergency SMS alerts are a Premium feature. Upgrade to access this functionality.');
        return;
      }

      if (!family?.emergency_contact) {
        alert('No emergency contact set. Please set one first.');
        return;
      }

      if (!confirm(`Send emergency alert for ${member.name}? This will immediately notify ${family.emergency_contact.name}.`)) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        let locationData = {
          location_address: 'Unknown location'
        };

        if (location) {
          locationData = {
            location_lat: location.lat,
            location_lng: location.lng,
            location_address: `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
          };
        }

        const response = await fetch(`${API_BASE_URL}/api/families/${family.id}/members/${member.id}/emergency-alert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(locationData)
        });

        if (response.ok) {
          alert(`Emergency alert sent to ${family.emergency_contact.name}!`);
        } else {
          alert('Failed to send emergency alert');
        }
      } catch (error) {
        console.error('Error sending emergency alert:', error);
        alert('Failed to send emergency alert');
      }
    };

    const scanConsumerMenu = async (url, restaurantName) => {
      setConsumerScanResults(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/consumer/scan-menu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            url: url,
            restaurant_name: restaurantName
          })
        });

        if (response.ok) {
          const data = await response.json();
          setConsumerScanResults(data);
          fetchScanHistory(); // Refresh scan history
          return data;
        } else {
          const error = await response.json();
          throw new Error(error.detail);
        }
      } catch (error) {
        console.error('Error scanning menu:', error);
        alert(`Menu scanning failed: ${error.message}`);
        return null;
      }
    };

    const analyzeMenuSafety = async (scanId, memberAllergies) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/consumer/analyze-safety/${scanId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(memberAllergies)
        });

        if (response.ok) {
          const data = await response.json();
          setSafetyResults(data);
          return data;
        }
      } catch (error) {
        console.error('Error analyzing menu safety:', error);
      }
    };

    const requestRestaurantSupport = async (restaurantName, restaurantUrl) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/consumer/request-restaurant-support`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            restaurant_name: restaurantName,
            restaurant_url: restaurantUrl,
            reason: "Consumer requested restaurant partnership for official allergen data"
          })
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Restaurant support requested successfully! ${user?.subscription_status === 'active' ? 'Your request has high priority as a Premium user.' : 'Upgrade to Premium for priority restaurant outreach.'}`);
        } else {
          alert('Failed to request restaurant support');
        }
      } catch (error) {
        console.error('Error requesting restaurant support:', error);
      }
    };

    const saveMenuToFavorites = async (scanId, menuName, notes = '') => {
      if (user?.subscription_status !== 'active') {
        alert('Saving favorite menus is a Premium feature. Upgrade to access this functionality.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/consumer/save-menu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            scan_id: scanId,
            menu_name: menuName,
            notes: notes
          })
        });

        if (response.ok) {
          alert('Menu saved to favorites!');
          fetchSavedMenus(); // Refresh saved menus
        } else {
          const error = await response.json();
          alert(error.detail);
        }
      } catch (error) {
        console.error('Error saving menu:', error);
      }
    };

    const simulateQRScan = async (restaurantId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/menu/${restaurantId}`);
        if (response.ok) {
          const menuData = await response.json();
          setScannedMenu(menuData);
          setActiveTab('scanner');
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    const checkMenuSafety = async (memberAllergies) => {
      if (!scannedMenu) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/menu/${scannedMenu.restaurant.id}/check-safety`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberAllergies)
        });
        
        if (response.ok) {
          const safetyData = await response.json();
          setSafetyResults(safetyData);
        }
      } catch (error) {
        console.error('Error checking menu safety:', error);
      }
    };

    if (showCreateFamily) {
      return <CreateFamilyForm onSubmit={createFamily} onCancel={() => setShowCreateFamily(false)} />;
    }

    if (!family) {
      return <LoadingSpinner message="Loading family data..." />;
    }

    return (
      <Dashboard title="Family" role="family">
        {/* Subscription Warning */}
        {family.subscription_warning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span>⚠️ {family.subscription_warning}</span>
              <div className="space-x-2 ml-4">
                <button
                  onClick={() => handleSubscription('family_monthly')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  $14.99/mo
                </button>
                <button
                  onClick={() => handleSubscription('family_annual')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  $149/yr (Save $30)
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <nav className="flex space-x-8 flex-wrap">
            {['overview', 'scan-any-menu', 'partner-scanner', 'emergency', 'history', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">👨‍👩‍👧‍👦 Family Members</h2>
              <div className="space-y-4">
                {family.members.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {member.allergies.length === 0 ? (
                            <span className="text-sm text-gray-500">No allergies</span>
                          ) : (
                            member.allergies.map((allergen) => (
                              <span
                                key={allergen}
                                className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                              >
                                ⚠️ {allergen}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      {member.allergies.length > 0 && (
                        <div className="ml-4 space-y-2">
                          <button
                            onClick={() => sendEmergencyAlert(member)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              user?.subscription_status === 'active' 
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={user?.subscription_status !== 'active'}
                            title={user?.subscription_status !== 'active' ? 'Premium feature' : ''}
                          >
                            {user?.subscription_status === 'active' ? '🚨 Emergency' : '🔒 Premium'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('scan-any-menu')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    🆓 Scan Any Restaurant Menu
                  </button>
                  <button
                    onClick={() => setActiveTab('partner-scanner')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    📱 Scan Partner QR Code
                  </button>
                  <button
                    onClick={() => setActiveTab('emergency')}
                    className={`w-full px-4 py-3 rounded-lg font-medium ${
                      user?.subscription_status === 'active' 
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={user?.subscription_status !== 'active'}
                  >
                    {user?.subscription_status === 'active' ? '🚨 Emergency Settings' : '🔒 Emergency Settings (Premium)'}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Subscription Status</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Plan</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user?.subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.subscription_status === 'active' ? '⭐ Premium' : '🆓 Free'}
                    </span>
                  </div>
                  
                  {user?.subscription_status === 'active' ? (
                    <div className="bg-green-100 rounded-lg p-3">
                      <h4 className="font-medium text-green-800 mb-2">Premium Features Active:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✅ Enhanced allergen detection</li>
                        <li>✅ Emergency SMS alerts</li>
                        <li>✅ Save favorite menus</li>
                        <li>✅ Priority restaurant requests</li>
                        <li>✅ Family profile management</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <h4 className="font-medium text-blue-800 mb-2">Free Features:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>✅ Scan any restaurant menu</li>
                          <li>✅ Basic allergen detection</li>
                          <li>✅ View scan history</li>
                          <li>✅ Request restaurant support</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleSubscription('family_annual')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Upgrade to Premium - $149/year
                      </button>
                      <button
                        onClick={() => handleSubscription('family_monthly')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Monthly Plan - $14.99/month
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {scanHistory.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Recent Scans</h3>
                  <div className="space-y-2">
                    {scanHistory.slice(0, 3).map((scan) => (
                      <div key={scan.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 truncate">{scan.restaurant_name}</span>
                        <span className="text-gray-500">{scan.total_items_found} items</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium"
                  >
                    View All History
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Any Menu Tab (New Consumer Feature) */}
        {activeTab === 'scan-any-menu' && (
          <ConsumerMenuScanner
            onScanComplete={scanConsumerMenu}
            onAnalyzeSafety={analyzeMenuSafety}
            onRequestSupport={requestRestaurantSupport}
            onSaveMenu={saveMenuToFavorites}
            scanResults={consumerScanResults}
            safetyResults={safetyResults}
            family={family}
            isPremium={user?.subscription_status === 'active'}
          />
        )}

        {/* Partner Scanner Tab (Existing QR functionality) */}
        {activeTab === 'partner-scanner' && (
          <div className="max-w-4xl mx-auto">
            {!scannedMenu ? (
              <QRScanner onScanSuccess={simulateQRScan} />
            ) : (
              <MenuSafetyChecker
                menu={scannedMenu}
                family={family}
                onCheckSafety={checkMenuSafety}
                safetyResults={safetyResults}
                onBack={() => { setScannedMenu(null); setSafetyResults(null); }}
              />
            )}
          </div>
        )}

        {/* Emergency Tab - Enhanced for Premium */}
        {activeTab === 'emergency' && (
          <div className="max-w-2xl mx-auto">
            {user?.subscription_status !== 'active' ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🔒 Emergency Features (Premium)</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">Upgrade to Premium for Emergency Features</h3>
                  <p className="text-yellow-700 mb-4">
                    Premium users get instant SMS emergency alerts with location data sent to emergency contacts during allergic reactions.
                  </p>
                  
                  <h4 className="font-medium text-yellow-800 mb-2">Premium Emergency Features:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1 mb-4">
                    <li>✅ Set emergency contacts</li>
                    <li>✅ One-tap emergency SMS alerts</li>
                    <li>✅ GPS location sharing in emergencies</li>
                    <li>✅ Allergy information included in alerts</li>
                  </ul>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSubscription('family_annual')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium"
                    >
                      Upgrade to Premium - $149/year
                    </button>
                    <button
                      onClick={() => handleSubscription('family_monthly')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium"
                    >
                      Monthly Plan - $14.99/month
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Full emergency features for premium users (existing code)
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🚨 Emergency Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Emergency Contact</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Set up an emergency contact who will receive SMS alerts with your location and allergy information if you tap the emergency button.
                    </p>
                    
                    {family.emergency_contact ? (
                      <div className="bg-white rounded p-4 mb-4">
                        <p className="font-medium text-gray-900">Current Emergency Contact:</p>
                        <p className="text-gray-700">{family.emergency_contact.name}</p>
                        <p className="text-gray-700">{family.emergency_contact.phone_number}</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                        <p className="text-yellow-800 font-medium">⚠️ No emergency contact set</p>
                        <p className="text-yellow-700 text-sm">Emergency alerts will not work until you set a contact.</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setShowEmergencyForm(!showEmergencyForm)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      {family.emergency_contact ? 'Update Contact' : 'Set Emergency Contact'}
                    </button>
                  </div>

                  {showEmergencyForm && (
                    <div className="border border-gray-300 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">Emergency Contact Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={emergencyContact.name}
                            onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                            placeholder="Emergency contact name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={emergencyContact.phone_number}
                            onChange={(e) => setEmergencyContact({...emergencyContact, phone_number: e.target.value})}
                            placeholder="+1234567890"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={setEmergencyContactInfo}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                          >
                            Save Contact
                          </button>
                          <button
                            onClick={() => setShowEmergencyForm(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">How Emergency Alerts Work:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Tap the red emergency button next to any family member</li>
                      <li>• An SMS will be sent immediately to your emergency contact</li>
                      <li>• The message includes the person's name, allergies, and your location</li>
                      <li>• Use this only in case of actual allergic reactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📊 Menu Scan History</h2>
              
              {scanHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No menu scans yet. Try scanning a restaurant menu!</p>
                  <button
                    onClick={() => setActiveTab('scan-any-menu')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Scan Your First Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{scan.restaurant_name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{scan.restaurant_url}</p>
                          <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                            <span>{scan.total_items_found} items found</span>
                            <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              scan.is_premium_analysis 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {scan.is_premium_analysis ? 'Premium Analysis' : 'Basic Scan'}
                            </span>
                          </div>
                        </div>
                        <div className="space-x-2">
                          {user?.subscription_status === 'active' && (
                            <button
                              onClick={() => saveMenuToFavorites(scan.id, scan.restaurant_name)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm font-medium"
                            >
                              Save to Favorites
                            </button>
                          )}
                          <button
                            onClick={() => requestRestaurantSupport(scan.restaurant_name, scan.restaurant_url)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium"
                          >
                            Request Partnership
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Menus (Premium Feature) */}
            {user?.subscription_status === 'active' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">⭐ Saved Favorite Menus (Premium)</h2>
                
                {savedMenus.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No saved menus yet. Save menus from your scan history!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedMenus.map((menu) => (
                      <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{menu.menu_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{menu.restaurant_name}</p>
                            {menu.notes && (
                              <p className="text-sm text-gray-500 mt-1">Note: {menu.notes}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Saved {new Date(menu.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Billing Tab - Same as before */}
        {activeTab === 'billing' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">💳 Family Subscription</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user?.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.subscription_status === 'active' ? '⭐ Premium' : '🆓 Free'}
                      </span>
                    </div>
                    {user?.subscription && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Package</p>
                          <p className="text-gray-900">{user.subscription.package_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Next Billing</p>
                          <p className="text-gray-900">
                            {new Date(user.subscription.next_billing_date).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Plan</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">$14.99</p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Enhanced allergen detection</li>
                      <li>✅ Emergency SMS alerts</li>
                      <li>✅ Save favorite menus</li>
                      <li>✅ Priority restaurant requests</li>
                    </ul>
                    {user?.subscription_status !== 'active' && (
                      <button
                        onClick={() => handleSubscription('family_monthly')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium mt-4"
                      >
                        Subscribe Monthly
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <div className="text-center mb-2">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">BEST VALUE</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Plan</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">$149</p>
                      <p className="text-sm text-gray-600">per year</p>
                      <p className="text-sm text-green-600 font-medium">Save $30/year</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ All Monthly features</li>
                      <li>✅ 2 months free</li>
                      <li>✅ Priority support</li>
                      <li>✅ Early access to features</li>
                    </ul>
                    {user?.subscription_status !== 'active' && (
                      <button
                        onClick={() => handleSubscription('family_annual')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium mt-4"
                      >
                        Subscribe Annually
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dashboard>
    );
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [families, setFamilies] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [smsLogs, setSmsLogs] = useState([]);
    const [emailLogs, setEmailLogs] = useState([]);
    const [paymentTransactions, setPaymentTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
      fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch all admin data in parallel
        const [
          statsResponse,
          restaurantsResponse,
          familiesResponse,
          subscriptionsResponse,
          smsLogsResponse,
          emailLogsResponse,
          paymentsResponse
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/admin/restaurants`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/admin/families`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/admin/subscriptions`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/admin/sms-logs`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/admin/email-logs`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/admin/payment-transactions`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (statsResponse.ok) setStats(await statsResponse.json());
        if (restaurantsResponse.ok) setRestaurants(await restaurantsResponse.json());
        if (familiesResponse.ok) setFamilies(await familiesResponse.json());
        if (subscriptionsResponse.ok) setSubscriptions(await subscriptionsResponse.json());
        if (smsLogsResponse.ok) setSmsLogs(await smsLogsResponse.json());
        if (emailLogsResponse.ok) setEmailLogs(await emailLogsResponse.json());
        if (paymentsResponse.ok) setPaymentTransactions(await paymentsResponse.json());
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    return (
      <Dashboard title="Admin" role="admin">
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'users', 'subscriptions', 'communications', 'payments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${stats.total_revenue}</p>
                  </div>
                  <div className="text-green-600 text-2xl">💰</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.active_subscriptions}</p>
                  </div>
                  <div className="text-blue-600 text-2xl">📈</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Emergency Alerts (30d)</p>
                    <p className="text-3xl font-bold text-red-600">{stats.emergency_alerts_30_days}</p>
                  </div>
                  <div className="text-red-600 text-2xl">🚨</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Published Menus</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.published_menus}</p>
                  </div>
                  <div className="text-purple-600 text-2xl">📋</div>
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_restaurants}</p>
                  </div>
                  <div className="text-green-600">🏪</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Families</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_families}</p>
                  </div>
                  <div className="text-purple-600">👨‍👩‍👧‍👦</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">SMS Sent (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recent_sms_sent}</p>
                  </div>
                  <div className="text-blue-600">📱</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Emails Sent (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recent_emails_sent}</p>
                  </div>
                  <div className="text-orange-600">📧</div>
                </div>
              </div>
            </div>

            {/* User Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Subscribers</span>
                    <span className="font-medium text-green-600">{stats.active_users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trial Users</span>
                    <span className="font-medium text-yellow-600">{stats.trial_users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Menu Items</span>
                    <span className="font-medium text-gray-900">{stats.total_menu_items}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Packages</h3>
                <div className="space-y-3">
                  {Object.entries(stats.subscription_packages).map(([id, pkg]) => (
                    <div key={id} className="flex justify-between">
                      <span className="text-gray-600">{pkg.name}</span>
                      <span className="font-medium text-gray-900">
                        ${pkg.amount}{pkg.interval === 'month' ? '/mo' : '/yr'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Restaurants */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">🏪 Restaurants ({restaurants.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                              <div className="text-sm text-gray-500">{restaurant.address}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              restaurant.menu_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {restaurant.menu_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              restaurant.user_subscription_status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {restaurant.user_subscription_status || 'trial'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Families */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">👨‍👩‍👧‍👦 Families ({families.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {families.map((family) => (
                        <tr key={family.id}>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">{family.family_name}</div>
                            <div className="text-sm text-gray-500">
                              {family.emergency_contact ? '🚨 Emergency Contact Set' : '⚠️ No Emergency Contact'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {family.members?.length || 0} members
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              family.user_subscription_status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {family.user_subscription_status || 'trial'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">💳 Active Subscriptions ({subscriptions.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Billing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{sub.user_name}</div>
                          <div className="text-sm text-gray-500">{sub.user_email}</div>
                          <div className="text-xs text-gray-400">{sub.user_role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sub.package_name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${sub.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(sub.next_billing_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="space-y-8">
            {/* SMS Logs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">📱 SMS Delivery Logs ({smsLogs.length})</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {smsLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            log.sms_type === 'emergency'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.sms_type === 'emergency' ? '🚨 Emergency' : log.sms_type}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{log.to_name}</div>
                            <div className="text-sm text-gray-500">{log.to_phone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.family_member || '-'}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Email Logs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">📧 Email Delivery Logs ({emailLogs.length})</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emailLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-4">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {log.email_type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.to_email}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{log.subject}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">💳 Payment Transactions ({paymentTransactions.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.user_name}</div>
                          <div className="text-sm text-gray-500">{transaction.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.package_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${transaction.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Dashboard>
    );
  };

  // Main render logic
  if (!user) {
    if (currentPage === 'register') {
      return <RegisterForm />;
    }
    return <LoginForm />;
  }

  if (user.role === 'restaurant') {
    return <RestaurantDashboard />;
  } else if (user.role === 'family') {
    return <FamilyDashboard />;
  } else if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <LoginForm />;
}

export default App;
