import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import deliveryImage from './Image/diliver.png'; // correct path based on your project
import axios from 'axios';
// import {
//   getStorage,
//   uploadBytesResumable,
//   ref,
//   getDownloadURL
// } from 'firebase/storage';
import Swal from 'sweetalert2';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from 'react-bootstrap';
import { AiOutlineUpload } from 'react-icons/ai';

export default function AddDiliverRole() {
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const fileRef1 = useRef(null);
  const navigate = useNavigate();
  // const { currentUser } = useSelector((state) => state.user);

  // State to store form data
  const [formData, setFormData] = useState({
    // userId: currentUser?._id || '',
    customerName: '',
    email: "",
    restaurantName: '',
    pickupTime: '',
    deliveryTime: '',
    deliveryAddress: '',
    totalAmount: '',
    createdAt: new Date().toISOString().slice(0, 16),
  });

  // State to store the selected order
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample orders list (this would be fetched from the backend)
  const orders = [
    {
      customerName: 'John Doe',
      email: 'shehansalitha1999@gmail.com',
      restaurantName: 'Pizza Place',
      pickupTime: '12:00',
      deliveryTime: '12:30',
      deliveryAddress: 'Negambo',
      totalAmount: '25.00',
    },
    {
      customerName: 'Jane Smith',
      email: 'shehansalitha1999@gmail.com',
      restaurantName: 'Burger King',
      pickupTime: '14:00',
      deliveryTime: '14:30',
      deliveryAddress: 'Kandy',
      totalAmount: '15.00',
    },
    // Add more sample orders as needed
  ];

  // Set form data when an order is clicked
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setFormData({
      customerName: order.customerName,
      email: order.email,
      restaurantName: order.restaurantName,
      pickupTime: order.pickupTime,
      deliveryTime: order.deliveryTime,
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount,
      createdAt: new Date().toISOString().slice(0, 16),
    });
  };

  useEffect(() => {
    if (image1) handleFileUpload(image1);
  }, [image1]);

  const validateForm = () => {
    const errs = {};

    if (!formData.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!formData.restaurantName.trim()) errs.restaurantName = 'Restaurant name is required';
    if (!formData.pickupTime) errs.pickupTime = 'Pickup time is required';
    if (!formData.deliveryTime) errs.deliveryTime = 'Delivery time is required';
    if (!formData.deliveryAddress.trim()) errs.deliveryAddress = 'Delivery address is required';
    if (!formData.totalAmount || isNaN(formData.totalAmount)) errs.totalAmount = 'Valid total amount is required';
    if (!formData.createdAt) errs.createdAt = 'Created at date is required';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please correct the highlighted fields.', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3002/api/diliver/addDilivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to submit');
        } else {
          const text = await res.text(); // get raw HTML or text
          console.error('Server response is not JSON:', text);
          throw new Error('Server returned an invalid response (not JSON)');
        }
      }

      // ✅ Safe to parse JSON here
      const resData = await res.json();

      // Send the email after successful delivery creation
      const emailResponse = await fetch('http://localhost:3002/api/diliver/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const emailContentType = emailResponse.headers.get('content-type');
      let emailData = {};

      if (emailContentType && emailContentType.includes('application/json')) {
        emailData = await emailResponse.json();
      } else {
        const emailText = await emailResponse.text();
        console.error('Email response is not JSON:', emailText);
        throw new Error('Invalid email server response');
      }

      if (emailResponse.ok && emailData.success) {
        console.log('Email sent successfully to', formData.email);
      } else {
        console.log('Failed to send email', emailData.message);
      }

      Swal.fire('Success!', 'Delivery details submitted successfully.', 'success');
      navigate('/DiliveryDetailsProfile');
      console.log('Created token:', token);

    } catch (err) {
      console.error(err);
      setError(err.message);
      Swal.fire('Error!', err.message, 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #83a4d4, #b6fbff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Card style={{
        maxWidth: '1100px',
        width: '100%',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        backgroundColor: '#ffffffee',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        padding: '1.5rem'
      }}>
        {/* Left Side - Form */}
        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="text-center mb-4" style={{
            color: '#FFD700', // Bright yellow to match the delivery theme
            fontSize: '1.3rem', // Larger font size for emphasis
            fontWeight: '600', // Make it bold
            textTransform: 'uppercase',
            letterSpacing: '2px',
            background: 'linear-gradient(45deg, #0d6efd, #FFD700)',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
            fontFamily: "'Poppins', sans-serif",
          }}>
            Add Delivery Details
          </h2>

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Form Columns */}
              <Col md={6}>
                <Form.Group controlId="customerName" className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Customer name"
                    value={formData.customerName}
                    isInvalid={!!formErrors.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.customerName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Customer Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Customer Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="restaurantName" className="mb-3">
                  <Form.Label>Restaurant Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Restaurant name"
                    value={formData.restaurantName}
                    isInvalid={!!formErrors.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.restaurantName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="pickupTime" className="mb-3">
                  <Form.Label>Pickup Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.pickupTime}
                    isInvalid={!!formErrors.pickupTime}
                    onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.pickupTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="deliveryTime" className="mb-3">
                  <Form.Label>Delivery Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.deliveryTime}
                    isInvalid={!!formErrors.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.deliveryTime}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="deliveryAddress" className="mb-3">
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Delivery address"
                    value={formData.deliveryAddress}
                    isInvalid={!!formErrors.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.deliveryAddress}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="totalAmount" className="mb-3">
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Total amount"
                    value={formData.totalAmount}
                    isInvalid={!!formErrors.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.totalAmount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Button variant="primary" type="submit" block>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {/* Right Side - Order List */}
        <div style={{
          flex: 1,
          padding: '1.5rem',
          borderLeft: '2px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h4 className="text-center mb-4" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            Orders
          </h4>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {orders.map((order, index) => (
              <li key={index} style={{
                padding: '1rem',
                backgroundColor: '#fff',
                marginBottom: '1rem',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                cursor: 'pointer'
              }} onClick={() => handleOrderClick(order)}>
                <h5>{order.customerName}</h5>
                <p>{order.restaurantName} - {order.totalAmount}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
