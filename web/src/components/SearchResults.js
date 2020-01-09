import React, { Component } from "react";
import "../styles/SearchResults.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class SearchResults extends Component {
  
  renderArtwork = () => {
    return (
      <div>
        Artwork
      </div>
    )
  }

  renderSummarySection = () => {
    return (
      <div>
        Summary
      </div>
    )
  }

  renderEpisodeSection = () => {
    return (
      <div>
        Episode Section
      </div>
    )
  }
  

  render() {
    return (
      <Container className="searchResults" fluid={true}>
        <Row>
          <Col sm={3} className="leftPane">
            {this.renderArtwork()}
          </Col>
          <Col sm={9} className="rightPane">
            <Row className="summarySection">
              {this.renderSummarySection()}
            </Row>
            <Row className="episodeSection">
              {this.renderEpisodeSection()}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SearchResults;