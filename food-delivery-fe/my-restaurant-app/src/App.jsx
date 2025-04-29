import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Restaurants from './pages/customer/Restaurants';
import RestaurantDetail from './pages/customer/RestaurantDetail';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantDetailsAdmin from './pages/admin/RestauratnDetailsAdmin';
import MenuManagement from './pages/restaurant/MenuManagement';
import { Navigate } from 'react-router-dom';

function App() {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Restaurants />} />
        <Route
          path="/restaurant/admin/:id"
          element={
            isAuthenticated ? <RestaurantDetailsAdmin /> : <Navigate to="/" />
          }
        />
        <Route path="/menu-management" element={<MenuManagement />} />
      </Routes>
    </Router>
  );
}

export default App;