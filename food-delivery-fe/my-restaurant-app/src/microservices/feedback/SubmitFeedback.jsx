import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar
} from 'react-bootstrap';
import { AiFillStar, AiOutlineStar, AiOutlineUpload } from 'react-icons/ai';

export default function SubmitFeedback() {
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const fileRef1 = useRef(null);
  const navigate = useNavigate();
  //const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
   // userId: currentUser._id,
    name: '',
    u_email: '',
    reviews: ''||null,
    selectraiting: 0,
  });

  useEffect(() => {
    if (image1) handleFileUpload(image1);
  }, [image1]);

  // const handleFileUpload = (file) => {
  //   const storage = getStorage(app);
  //   const fileName = `${Date.now()}_${file.name}`;
  //   const storeRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storeRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     (snap) => {
  //       const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
  //       setImagePercent(pct);
  //     },
  //     () => {
  //       setImageError(true);
  //       setError('Image upload failed');
  //     },
  //     () =>
  //       getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //         setFormData((f) => ({ ...f, profilePicture: url }));
  //       })
  //   );
  // };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.u_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.u_email = 'Valid email is required';
    //if (!formData.reviews.trim()) errs.reviews = 'Review cannot be empty';
    setFormErrors(errs);
    return !Object.keys(errs).length;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   if (!validateForm()) return;
  //   try {
  //     const res = await fetch('/api/feedback/addFeedback', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData)
  //     });
  //     if (!res.ok) throw new Error((await res.json()).message || 'Failed');
  //     Swal.fire('Thank you!', 'Your feedback has been submitted.', 'success');
  //     navigate('/MyFeedback');
  //   } catch (err) {
  //     setError(err.message);
  //     Swal.fire('Oops!', err.message, 'error');
  //   }
  // };


    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (!validateForm()) {
        Swal.fire('Validation Error', 'Please correct the highlighted fields.', 'warning');
        return;
      }
  
      try {
        const token = localStorage.getItem('token'); // ✅ Retrieve JWT from storage
  
        const res = await fetch('http://localhost:3001/api/feedback/addFeedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // ✅ Include token in header
          },
          body: JSON.stringify(formData),
        });
  console.log("create token",token)
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to submit');
        }

        const emailResponse = await fetch('http://localhost:3001/api/feedback/FeedbacksendMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.u_email }),
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
          console.log('Email sent successfully to', formData.u_email);
        } else {
          console.log('Failed to send email', emailData.message);
        }
  
        Swal.fire('Success!', 'Delivery details submitted successfully.', 'success');
        navigate('/FeedbackProfile');
      } catch (err) {
        setError(err.message);
        Swal.fire('Error!', err.message, 'error');
      }
    };

  return (
    <Container
      fluid
      style={{
        marginTop: '50px',
        width: 'calc(100% - 240px)',
        padding: '2rem 1rem'
      }}
    >
      <Row className="justify-content-center">
        <Col lg={7}>
          <Card className="shadow-lg p-4">
            <Card.Header className="bg-success text-white text-center rounded mb-4">
              <h2>We Value Your Feedback</h2>
              <p className="mb-0 small">Tell us about your experience — it only takes a minute!</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>

                {/* Basic Info */}
                <h5 className="mb-3">Your Information</h5>
                <Form.Group controlId="feedbackName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    isInvalid={!!formErrors.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="feedbackEmail" className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="you@example.com"
                    value={formData.u_email}
                    isInvalid={!!formErrors.u_email}
                    onChange={(e) =>
                      setFormData({ ...formData, u_email: e.target.value })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.u_email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Upload Profile Picture */}
               

                {/* Service Details */}
              

                <Form.Group controlId="feedbackReviews" className="mb-4">
                  <Form.Label>Share Your Experience</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tell us what you loved or what we could do better..."
                    value={formData.reviews}
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: e.target.value })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.reviews}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Rating Section */}
                <h5 className="mb-3">Your Rating</h5>
                <div className="mb-4 text-center">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      style={{ cursor: 'pointer', fontSize: '2rem' }}
                      onClick={() =>
                        setFormData({ ...formData, selectraiting: n })
                      }
                    >
                      {n <= formData.selectraiting ? (
                        <AiFillStar className="text-warning" />
                      ) : (
                        <AiOutlineStar className="text-secondary" />
                      )}
                    </span>
                  ))}
                  {formErrors.selectraiting && (
                    <div className="text-danger small">{formErrors.selectraiting}</div>
                  )}
                </div>

                {/* Submit Button */}
                <Button variant="success" type="submit" size="lg" className="w-100">
                  Submit Feedback
                </Button>

                {error && (
                  <div className="mt-3 text-danger text-center">{error}</div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
