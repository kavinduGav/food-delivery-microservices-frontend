import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Container, Row, Col, Card, Button, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase';
import { useReactToPrint } from 'react-to-print';
import Header from '../../components/header';

export default function FeedbackProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [feedbacks, setFeedbacks] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const componentPDF = useRef();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`/api/feedback/getFeedback/${currentUser._id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFeedbacks(data);
      data.forEach(fb => {
        if (fb.profilePicture) fetchImage(fb.profilePicture, 'avatar', fb._id);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async (path, field, id) => {
    try {
      const url = await getDownloadURL(ref(storage, path));
      setFeedbacks(prev => prev.map(fb => fb._id === id ? { ...fb, [field]: url } : fb));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/feedback/deleteFeedback/${orderIdToDelete}`, { method: 'DELETE' });
      if (res.ok) setFeedbacks(prev => prev.filter(fb => fb._id !== orderIdToDelete));
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Feedback_Report',
    onBeforeGetContent: () => { setIsGeneratingPDF(true); return Promise.resolve(); },
    onAfterPrint: () => { setIsGeneratingPDF(false); alert('PDF Generated!'); }
  });

  const filtered = feedbacks.filter(fb => fb.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Container className="py-5" style={{ marginTop: '50px' }}>
      <h2 className="text-center mb-4 display-6 fw-bold border-bottom border-primary pb-2">
        My Feedback
      </h2>

      <Row className="justify-content-between align-items-center mb-3">
        <Col xs={12} md={{ span: 4, offset: 4 }} className="mb-2">
          <InputGroup>
            <FormControl
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <div ref={componentPDF}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row xs={1} md={1} lg={1} className="g-4">
            {filtered.length ? filtered.map(fb => (
              <Col key={fb._id}>
                <Card className="shadow-lg rounded-3">
                  {fb.avatar && (
                    <Card.Img variant="top" src={fb.avatar} alt="User avatar" className="rounded-circle" style={{ height: '150px', width: '150px', objectFit: 'cover', margin: '0 auto' }} />
                  )}
                  <Card.Body>
                    <Card.Title className="text-center">{fb.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-center">{fb.u_email}</Card.Subtitle>
                    <Card.Text className="mb-2">{fb.reviews}</Card.Text>
                    <div className="d-flex justify-content-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: '1.9rem' }}> {/* Increased size */}
                          {i < Number(fb.selectraiting) ? <AiFillStar className="text-warning" /> : <AiOutlineStar className="text-secondary" />}
                        </span>
                      ))}
                    </div>

                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-end bg-white border-0">
                    <Button variant="danger" size="sm" onClick={() => { setShowModal(true); setOrderIdToDelete(fb._id); }}>
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            )) : (
              <Col>
                <p className="text-center">No feedback found.</p>
              </Col>
            )}
          </Row>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body className="text-center">
          <HiOutlineExclamationCircle size={50} className="mb-3 text-danger" />
          <p>Are you sure you want to delete this feedback?</p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
