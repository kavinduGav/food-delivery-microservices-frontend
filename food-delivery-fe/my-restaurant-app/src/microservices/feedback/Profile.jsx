import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';
import { Button, Table, Form, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { ListGroup } from 'react-bootstrap';
import { AiOutlinePlusCircle, AiOutlineUnorderedList } from 'react-icons/ai';

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signout
} from  '../../redux/User/userSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/profile.css';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      alert('User deleted successfully');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <Card className="shadow-lg rounded-4 w-75 p-0 overflow-hidden">
        <Row className="g-0">
          {/* Left: Profile Form */}
          <Col md={8} className="p-4 bg-white">
            <h2 className="text-center mb-4 text-primary">Profile</h2>
            <div className="text-center mb-3">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
              />
              <img
                src={formData.profilePicture || currentUser.profilePicture}
                alt="profile"
                className="rounded-circle img-thumbnail mb-3"
                style={{ width: 140, height: 140, objectFit: 'cover', cursor: 'pointer', transition: 'transform .2s' }}
                onClick={() => fileRef.current.click()}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              {imageError && <Alert variant="danger">Error uploading image (Max 2MB)</Alert>}
              {imagePercent > 0 && imagePercent < 100 && (
                <Alert variant="info">Uploading: {imagePercent}%</Alert>
              )}
              {imagePercent === 100 && <Alert variant="success">Image uploaded successfully</Alert>}
            </div>
    
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  defaultValue={currentUser.username}
                  type="text"
                  id="username"
                  placeholder="Username"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  defaultValue={currentUser.email}
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                variant="primary"
                className="w-100 mb-3"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
              </Button>
            </Form>
    
            <div className="d-flex justify-content-between">
              <Button variant="outline-danger" onClick={handleDeleteAccount}>
                Close Account
              </Button>
              <Button variant="outline-secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
    
            {(error || updateSuccess) && (
              <Alert
                variant={error ? 'danger' : 'success'}
                className="mt-3 text-center"
              >
                {error ? 'Something went wrong.' : 'User updated successfully!'}
              </Alert>
            )}
          </Col>
    
          {/* Right: Quick Links */}
          <Col md={4} className="bg-light p4">
            <Card className="border-2 shadow-sm">
              <Card.Header className="bg-primary text-white text-center fw-bold">
                Quick Links
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  as={Link}
                  to="/submitFeedback"
                  className="d-flex align-items-center"
                >
               
                  <AiOutlinePlusCircle className="me-2 fs-4 text-primary" />
                  Add Feedback
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  as={Link}
                  to="/MyFeedback"
                  className="d-flex align-items-center"
                >
                  <AiOutlineUnorderedList className="me-2 fs-4 text-primary" />
                  My Feedbacks
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Card>
    </Container>
    
  );
}