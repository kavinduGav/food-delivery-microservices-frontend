import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
//import { app } from '../../firebase';
// import { useSelector } from 'react-redux';
import deliveryImage from './Image/diliver.png'; // correct path based on your project

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

  const [formData, setFormData] = useState({
   // userId: currentUser?._id || '',
    customerName: '',
    restaurantName: '',
    pickupTime: '',
    deliveryTime: '',
    deliveryAddress: '',
    totalAmount: '',
    createdAt: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (image1) handleFileUpload(image1);
  }, [image1]);

 // const handleFileUpload = (file) => {
   // const storage = getStorage(app);
   // const fileName = `${Date.now()}_${file.name}`;
   // const storeRef = ref(storage, fileName);
   // const uploadTask = uploadBytesResumable(storeRef, file);

    // uploadTask.on(
    //   'state_changed',
    //   (snap) => {
    //     const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
    //     setImagePercent(pct);
    //   },
    //   () => {
    //     setImageError(true);
    //     setError('Image upload failed');
    //   },
    //   () =>
    //     getDownloadURL(uploadTask.snapshot.ref).then((url) => {
    //       setFormData((f) => ({ ...f, profilePicture: url }));
    //     })
    // );
 // };

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
      const res = await fetch('/api/diliver/addDilivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to submit');

      Swal.fire('Success!', 'Delivery details submitted successfully.', 'success');
      navigate('/MyDiliveryDetails');
    } catch (err) {
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
                    type="text"
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
            </Row>

            <Button variant="success" type="submit" className="w-100 mt-4">
              Confirm Delivery
            </Button>

            {error && <div className="mt-3 text-danger text-center">{error}</div>}
          </Form>
        </div>

        {/* Right Side - Image */}
        <div style={{
          flex: 1,
          background: `url(${deliveryImage}) no-repeat center`,
          backgroundSize: '80%',
          backgroundPosition: 'center',
          backgroundColor: '#f0f8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} />
      </Card>
    </div>
  );
}
