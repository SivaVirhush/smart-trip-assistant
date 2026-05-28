import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

const Features = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5">Features & Tools</h1>
      <p className="text-center mb-5">
        Explore our powerful tools designed to enhance your cultural site visits
      </p>
      <div className="alert alert-info text-center">
        Guest-only mode: tools work for the current browser session and reset
        on refresh.
      </div>

      <Row className="justify-content-center">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="card-title">AI Calendar</h2>
              <p className="card-text">
                Plan your cultural visits with our smart AI-powered calendar.
                Create events and get intelligent recommendations for the
                current guest session.
              </p>
              <Link to="/calendar" className="btn btn-success">
                Open Calendar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="card-title">Cultural Maps</h2>
              <p className="card-text">
                Discover temples and cultural sites near you with our
                interactive map. Get detailed information and navigation.
              </p>
              <Link to="/cultural-maps" className="btn btn-success">
                Explore Map
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="card-title">Live Traffic Data</h2>
              <p className="card-text">
                Get real-time traffic information around major cultural sites in
                Tamil Nadu to plan your visit efficiently.
              </p>
              <Link to="/live-traffic" className="btn btn-success">
                View Traffic
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="card-title">Current Affairs</h2>
              <p className="card-text">
                Stay updated with the latest happenings about Tamil Nadu's
                cultural heritage, temple discoveries, literature, and
                archaeological findings.
              </p>
              <Link to="/current-affairs" className="btn btn-success">
                View Updates
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Features;
