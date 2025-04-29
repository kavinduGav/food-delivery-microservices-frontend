// payment-frontend/src/pages/PaymentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert, Container, ListGroup } from 'react-bootstrap';
import { getPaymentById } from './services/paymentService';

const PaymentDetailPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        setLoading(true);
        const data = await getPaymentById(paymentId);
        setPayment(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError('Failed to load payment details. Please try again later.');
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetail();
    }
  }, [paymentId]);

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'completed':
        variant = 'success';
        break;
      case 'pending':
        variant = 'warning';
        break;
      case 'failed':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status.toUpperCase()}</Badge>;
  };

  const getMethodBadge = (method) => {
    let variant;
    switch (method) {
      case 'payhere':
        variant = 'info';
        break;
      case 'card':
        variant = 'primary';
        break;
      case 'cod':
        variant = 'secondary';
        break;
      default:
        variant = 'light';
    }
    return <Badge bg={variant}>{method.toUpperCase()}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading payment details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Payment</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/payment/history')}>
              Return to Payment History
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!payment) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <Alert.Heading>Payment Not Found</Alert.Heading>
          <p>The requested payment could not be found.</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-primary" onClick={() => navigate('/payment/history')}>
              Return to Payment History
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0">Payment Details</h2>
          <Button variant="light" size="sm" onClick={() => navigate('/payment/history')}>
            Back to History
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h3 className="h5 mb-0">Payment Information</h3>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Payment ID:</strong> <span className="text-muted">{payment._id}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Order ID:</strong> <span className="text-muted">{payment.orderId}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Amount:</strong>{' '}
                    <span className="text-muted">
                      {payment.currency} {payment.amount?.toFixed(2)}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong> {getStatusBadge(payment.status)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Payment Method:</strong> {getMethodBadge(payment.paymentMethod)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Transaction ID:</strong>{' '}
                    <span className="text-muted">{payment.transactionId || 'N/A'}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h3 className="h5 mb-0">Timeline</h3>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Created:</strong> <br />
                    <span className="text-muted">{formatDate(payment.createdAt)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Last Updated:</strong> <br />
                    <span className="text-muted">{formatDate(payment.updatedAt)}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              {payment.customerDetails && (
                <Card>
                  <Card.Header className="bg-light">
                    <h3 className="h5 mb-0">Customer Information</h3>
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Name:</strong>{' '}
                      <span className="text-muted">{payment.customerDetails.name || 'N/A'}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Email:</strong>{' '}
                      <span className="text-muted">{payment.customerDetails.email || 'N/A'}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              )}
            </Col>
          </Row>

          

          <div className="mt-4 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => navigate('/payment/history')}>
              Back to Payment History
            </Button>
            {payment.status === 'pending' && (
              <Button variant="danger" disabled>
                Cancel Payment
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentDetailPage;