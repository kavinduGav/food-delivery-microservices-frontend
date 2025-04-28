import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Restaurants from './pages/customer/Restaurants';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubmitFeedback from './microservices/feedback/SubmitFeedback';
// import SignIn from './microservices/feedback/Signin';
// import SignUp from './microservices/feedback/SignUp';
import Profile from './microservices/feedback/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<div>Home Page</div>} />



        <Route path="/SubmitFeedback" element={<SubmitFeedback />} />
        {/* <Route path="/signinNew" element={<SignIn />} />
        <Route path="/SignUPnEW" element={<SignUp />} /> */}
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;