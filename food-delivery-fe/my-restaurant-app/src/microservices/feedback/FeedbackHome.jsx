import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export default function FeedbackHome() {
  return (
    <Container
      fluid
      className="p-0"
      style={{
        width: 'calc(100% - 240px)'     // fill remaining space
      }}
    >
      {/* Hero Banner */}
      <div
        className="position-relative text-white"
        style={{
          height: '60vh',
          backgroundImage: 'url("https://source.unsplash.com/1600x900/?restaurant,food")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* dark overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        />

        <div
          className="position-absolute top-50 start-50 text-center px-3"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <h1
            className="display-3 fw-bold mb-3"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
          >
            We Value Your Feedback
          </h1>
          <p
            className="lead mb-4"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
          >
            Let us know how your dining experience was—your insights help us serve you better.
          </p>
          <Link to="/submitFeedback">
            <Button variant="primary" size="lg" className="me-3">
              Submit Feedback
            </Button>
          </Link>
          <Link to="/MyFeedback">
            <Button variant="outline-light" size="lg">
              View Reviews
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Reviews Section */}
      <Container className="py-5">
        <h2
          className="text-center mb-5"
          style={{ fontWeight: 600 }}
        >
          Recent Reviews
        </h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {/* Replace these static cards with dynamic data from your API */}
          <Col>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>⭐️⭐️⭐️⭐️☆</Card.Title>
                <Card.Text>
                  “The ambience was perfect and the steak was cooked to perfection!
                  Highly recommend the wine selection.”
                </Card.Text>
                <br></br>
                <footer className="blockquote-footer">
                  by <cite title="Jane Doe">Jane Doe</cite>
                </footer>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>⭐️⭐️⭐️⭐️⭐️</Card.Title>
                <Card.Text>
                  “Exceptional service and incredible flavors. My go-to place
                  for any celebration.”
                </Card.Text>
                <br></br>
                <footer className="blockquote-footer">
                  by <cite title="John Smith">John Smith</cite>
                </footer>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>⭐️⭐️⭐️☆☆</Card.Title>
                <Card.Text>
                  “Good food but the wait time was a bit long. Will give them another try.”
                </Card.Text>
                <br></br>
                <footer className="blockquote-footer">
                  by <cite title="Alex Lee">Alex Lee</cite>
                </footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
