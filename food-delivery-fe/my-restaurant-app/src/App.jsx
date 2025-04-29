import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { signOut } from './utils/auth';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Restaurants from './pages/customer/Restaurants';
import RestaurantDetail from './pages/customer/RestaurantDetail';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">Food Delivery</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;