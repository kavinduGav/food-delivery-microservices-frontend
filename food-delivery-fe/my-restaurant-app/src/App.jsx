import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Restaurants from './pages/customer/Restaurants';
import RestaurantDetail from './pages/customer/RestaurantDetail';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubmitFeedback from './microservices/feedback/SubmitFeedback';
import FeedbackProfile from './microservices/feedback/FeedbackProfile';
import AddDiliverRole from './microservices/DiliverRole/CreateDiliverRole';
import DiliveryDetailsProfile from './microservices/DiliverRole/DiliveryDetailsProfile';
import CompleteDiliveryDetails from './microservices/DiliverRole/CompleteDiliveryDetails';
import Header from './microservices/header/header';
import UserViewDiliveryDetailsProfile from './microservices/DiliverRole/userViewDiliveryDetailsProfile';

function App() {
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




        <Route path="/SubmitFeedback" element={<SubmitFeedback />} />
        <Route path="/FeedbackProfile" element={<FeedbackProfile />} />
        <Route path="/AddDiliverRole" element={<div><Header /><AddDiliverRole /></div>} />
        <Route path="/DiliveryDetailsProfile" element={<div><Header /><DiliveryDetailsProfile /></div>} />
        <Route path="/UserViewDiliveryDetailsProfile" element={<UserViewDiliveryDetailsProfile />} />
        <Route path="/update-task/:id" element={<CompleteDiliveryDetails />} />
        <Route path="/Header" element={<Header />} />

      </Routes>
    </Router>
  );
}

export default App;