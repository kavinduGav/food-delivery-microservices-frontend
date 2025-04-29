import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Steps, Button, Spin, Alert, Card } from 'antd';
import { ShoppingOutlined, CreditCardOutlined, CheckOutlined } from '@ant-design/icons';

import PaymentMethod from './PaymentMethod';
import PaymentSummary from './PaymentSummary';
import PayHereForm from './PayHereForm';
import { getOrderDetails, initializePayment, confirmPayment } from './services/paymentService';

const { Step } = Steps;

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  // const { currentUser } = useSelector((state) => state.user);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('payhere');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
     // if (!currentUser)
        if ("") {
        navigate('/sign-in');
        return;
      }
      
      try {
        setLoading(true);
        let orderData;
        
        if (orderId) {
          orderData = await getOrderDetails(orderId);
        } else {
          // Mock order for testing
          orderData = {
            id: 'ORDER' + Math.floor(Math.random() * 1000),
            restaurant: {
              id: 'rest123',
              name: 'Delicious Bites Restaurant'
            },
            items: [
              { name: 'Chicken Biryani', quantity: 2, price: 850 },
              { name: 'Vegetable Curry', quantity: 1, price: 550 },
              { name: 'Mango Lassi', quantity: 2, price: 250 }
            ],
            subtotal: 2750,
            deliveryFee: 250,
            discount: 300,
            total: 2700,
            deliveryAddress: '123 Main St, Colombo 05, Sri Lanka',
            status: 'pending'
          };
        }
        
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Unable to load order details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  },
  //  [orderId, currentUser, navigate]); 
   [orderId, navigate]);
  
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    // Reset payment details when changing methods
    setPaymentDetails(null);
  };
  
  const handleContinue = () => {
    setCurrentStep(1);
  };
  
  const handleBack = () => {
    setCurrentStep(0);
    // Reset payment details when going back
    setPaymentDetails(null);
  };
  
  const handlePaymentSubmit = async () => {
    console.log('Payment submit button clicked');
    try {
      setSubmitting(true);
      setError(null);
      
      //console.log('Current user:', currentUser);
      //if (!currentUser) {
        if ("") {
        console.log('No current user, redirecting to sign-in');
        navigate('/sign-in');
        return;
      }
      
      // Customer details from the current user
      const customerDetails = {
       
        
        userId: body?._id,
        name: body?.username,
        email: body?.email,

        // userId: currentUser?._id,
        // name: currentUser?.username,
        // email: currentUser?.email,
      };
      console.log('Customer details:', customerDetails);
      console.log('Order details:', order);
      
      // Initialize payment
      console.log('Initializing payment with backend');
      const paymentResponse = await initializePayment({
        orderId: order.id,
        amount: order.total,
        currency: 'LKR',
        paymentMethod: selectedMethod,
        customerDetails
      });
      
      console.log('Payment response:', paymentResponse);
      setPaymentId(paymentResponse.payment.id);
      
      if (selectedMethod === 'payhere') {
        console.log('PayHere selected, setting payment details');
        
        // IMPORTANT FIX: Create the correct structure for paymentDetails
        const paymentDetails = {
          redirectUrl: paymentResponse.payment.redirectUrl,
          paymentData: paymentResponse.payment.paymentData
        };
        
        setPaymentDetails(paymentDetails);
        console.log('PayHere details set:', paymentDetails);
        
        // Direct form submission for immediate action
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResponse.payment.redirectUrl;
        
        // Add all payment data as hidden fields
        Object.entries(paymentResponse.payment.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        // Add form to document and submit
        document.body.appendChild(form);
        console.log('Submitting form to PayHere...');
        form.submit();
        
      } else if (selectedMethod === 'cod') {
        // For Cash on Delivery processing
        await confirmPayment(paymentResponse.payment.id, {
          status: 'pending'
        });
        
        navigate(`/payment/success?order_id=${order.id}&method=cod`);
      }
      
      setSubmitting(false);
    } catch (err) {
      console.error('Payment submission error details:', err);
      setError('Payment processing failed. Please try again.');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading checkout details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="error-container">
        <Alert 
          message="Checkout Error" 
          description="Could not load order details. Please try again or contact support." 
          type="error" 
          showIcon 
        />
        <Button 
          type="primary" 
          onClick={() => window.history.back()} 
          className="back-button"
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <Card className="checkout-card">
        <h1 className="page-title">Checkout</h1>
        
        <Steps current={currentStep} className="checkout-steps">
          <Step title="Order Summary" icon={<ShoppingOutlined />} />
          <Step title="Payment" icon={<CreditCardOutlined />} />
          <Step title="Confirmation" icon={<CheckOutlined />} />
        </Steps>
        
        {error && (
          <Alert
            message="Payment Error"
            description={error}
            type="error"
            showIcon
            closable
            className="error-alert"
          />
        )}
        
        <Row gutter={[24, 24]} className="checkout-content">
          <Col xs={24} lg={currentStep === 0 ? 24 : 16}>
            {currentStep === 0 && (
              <>
                <PaymentSummary order={order} />
                <div className="checkout-actions">
                  <Button 
                    type="primary" 
                    size="large"
                    className="continue-button"
                    onClick={handleContinue}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </>
            )}
            
            {currentStep === 1 && (
              <>
                <div className="payment-section">
                  <br></br><br></br>
                  <h2>Select Payment Method</h2>
                  <PaymentMethod 
                    selectedMethod={selectedMethod} 
                    onSelectMethod={handleMethodSelect} 
                  />
                  
                  {selectedMethod === 'payhere' && (
                    paymentDetails ? (
                      <PayHereForm 
                        paymentDetails={paymentDetails} 
                        loading={submitting} 
                      />
                    ) : (
                      <div className="payment-provider-info">
                        <p>You will be redirected to PayHere to complete your payment.</p>
                        <Button 
                          type="primary" 
                          size="large" 
                          className="payment-button"
                          onClick={handlePaymentSubmit}
                          loading={submitting}
                        >
                          Pay with PayHere
                        </Button>
                      </div>
                    )
                  )}
                  
                  {selectedMethod === 'cod' && (
                    <div className="payment-provider-info">
                      <div className="cod-icon">💵</div>
                      <h3>Cash On Delivery</h3>
                      <p>Pay in cash when your order is delivered.</p>
                      <Button 
                        type="primary" 
                        size="large" 
                        className="payment-button"
                        onClick={handlePaymentSubmit}
                        loading={submitting}
                      >
                        Place Order (Pay on Delivery)
                      </Button>
                    </div>
                  )}
                  
                  <div className="payment-actions">
                    <Button 
                      onClick={handleBack} 
                      disabled={submitting}
                      className="back-button"
                    >
                      Back to Order Summary
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Col>
          
          {currentStep === 1 && (
            <Col xs={24} lg={8}>
              <PaymentSummary order={order} />
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default CheckoutPage;