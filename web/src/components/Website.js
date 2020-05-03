import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Search from "./Search";
import "../styles/Website.scss";

class Website extends Component {

  render() {
    return (
      <Container className="website">
        <Col md={12} className="notice">
          The podcast index was last updated January 2020. Please allow a few seconds for the first search result.
        </Col>
        <Row>
          <Search/>
        </Row>
      </Container>
    )
  }
}

export default Website;
