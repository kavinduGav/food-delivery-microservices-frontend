// payment-frontend/src/pages/PaymentHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Table, Badge, Button, Form, Card, Container, Row, Col, Spinner } from 'react-bootstrap';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate(); // Add this hook
  
  useEffect(() => {
    fetchPaymentHistory();
  }, []);
  
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const data = await getPaymentHistory();
      setPayments(data.payments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Failed to load payment history. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  // Handle view details navigation
  const handleViewDetails = (paymentId) => {
    navigate(`/payment/${paymentId}`);
  };
  
  // Filter payments based on search text and date range
  const filteredPayments = payments.filter(payment => {
    // Filter by search text
    const searchMatch = searchText === '' || 
      payment.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.paymentMethod.toLowerCase().includes(searchText.toLowerCase());
    
    // Filter by date range
    let dateMatch = true;
    if (dateRange.from && dateRange.to) {
      const paymentDate = new Date(payment.createdAt);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setDate(toDate.getDate() + 1); // Include the end date
      
      dateMatch = paymentDate >= fromDate && paymentDate <= toDate;
    }
    
    return searchMatch && dateMatch;
  });
  
  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2 className="h4 mb-0">Payment History</h2>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by order ID or payment method"
                  value={searchText}
                  onChange={handleSearch}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Control
                      type="date"
                      name="from"
                      value={dateRange.from}
                      onChange={handleDateChange}
                      placeholder="From Date"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Control
                      type="date"
                      name="to"
                      value={dateRange.to}
                      onChange={handleDateChange}
                      placeholder="To Date"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading payment history...</p>
            </div>
          ) : error ? (
            <div className="text-center my-5">
              <p className="text-danger">{error}</p>
              <Button variant="primary" onClick={fetchPaymentHistory}>Try Again</Button>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center my-5">
              <p>No payment records found.</p>
            </div>
          ) : (
            <Table responsive striped hover className="mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td>{payment.orderId}</td>
                    <td>{payment.currency} {payment.amount.toFixed(2)}</td>
                    <td>
                      <Badge bg={
                        payment.paymentMethod === 'payhere' ? 'info' :
                        payment.paymentMethod === 'card' ? 'primary' :
                        payment.paymentMethod === 'cod' ? 'secondary' : 'light'
                      }>
                        {payment.paymentMethod.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={
                        payment.status === 'completed' ? 'success' :
                        payment.status === 'pending' ? 'warning' :
                        payment.status === 'failed' ? 'danger' : 'secondary'
                      }>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(payment._id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentHistoryPage;