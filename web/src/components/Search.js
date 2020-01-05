import React, { Component } from "react";
import "../styles/Search.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchBar from "./SearchBar";

class Search extends Component {
  render() {
    return (
      <Container className="search" fluid={true}>
        <Row>
          <Col sm={12}>
            <div className="searchMessage">
              Search through X podcasts
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <SearchBar/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;