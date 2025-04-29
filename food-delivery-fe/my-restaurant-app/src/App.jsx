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
import CheckoutPage from './microservices/payment/CheckoutPage';
import CreditCardForm from './microservices/payment/CreditCardForm';
import PayHereForm from './microservices/payment/PayHereForm';
import PaymentConfirmationPage from './microservices/payment/PaymentConfirmationPage';
import PaymentDetailPage from './microservices/payment/PaymentDetailPage';
import PaymentHistoryPage from './microservices/payment/PaymentHistoryPage';
import PaymentMethod from './microservices/payment/PaymentMethod';
import PaymentSummary from './microservices/payment/PaymentSummary';

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
        <Route path="/AddDiliverRole" element={<AddDiliverRole />} />
        <Route path="/DiliveryDetailsProfile" element={<DiliveryDetailsProfile />} />
        <Route path="/update-task/:id" element={<CompleteDiliveryDetails />} />


        <Route path="/checkout/:orderId" element={<CheckoutPage />} />
        {/* <Route path="/CreditCardForm" element={<CreditCardForm />} />
        <Route path="/PayHereForm" element={<PayHereForm />} /> */}
        <Route path="/payment/success" element={<PaymentConfirmationPage success={true} />} />
        <Route path="/payment/cancel" element={<PaymentConfirmationPage success={false} />} />
        <Route path="/payment/:paymentId"  element={<PaymentDetailPage/>} />
        <Route path="/payment/history" element={<PaymentHistoryPage/>} />
        <Route path="/PaymentMethod" element={<PaymentMethod/>} />
        <Route path="/PaymentSummary" element={<PaymentSummary/>} />
        {/* Default route */}
        <Route path="/checkoutPage" element={<CheckoutPage />} />

      </Routes>
    </Router>
  );
}

export default App;