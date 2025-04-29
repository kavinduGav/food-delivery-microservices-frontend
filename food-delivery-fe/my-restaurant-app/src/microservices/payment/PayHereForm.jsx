import React, { useEffect } from 'react';
import { Button, Card } from 'antd';
import { BankOutlined } from '@ant-design/icons';

const PayHereForm = ({ paymentDetails, loading }) => {
  useEffect(() => {
    if (paymentDetails && !loading) {
      // Give a little delay to ensure component is fully mounted
      setTimeout(() => {
        handleSubmit();
      }, 1000);
    }
  }, [paymentDetails, loading]);

  const handleSubmit = () => {
    if (!paymentDetails || !paymentDetails.redirectUrl || !paymentDetails.paymentData) {
      console.error('Missing payment details for PayHere:', paymentDetails);
      return;
    }
    
    const { redirectUrl, paymentData } = paymentDetails;
    
    // Create form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = redirectUrl;
    form.target = '_self'; // Ensure it loads in the same window
    
    // Add all payment data as hidden fields
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
        console.log(`Added field: ${key}=${value}`);
      }
    });
    
    // Add form to document and submit
    document.body.appendChild(form);
    console.log('Form submitted with data:', paymentData);
    form.submit();
  };
  
  return (
    <Card title="PayHere Payment" className="payhere-form">
      <div className="payment-provider-info">
        <h3>Pay with PayHere</h3>
        <p>You will be redirected to PayHere's secure payment gateway.</p>
        
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="payment-button"
          icon={<BankOutlined />}
          size="large"
        >
          Proceed to PayHere
        </Button>
      </div>
    </Card>
  );
};

export default PayHereForm;