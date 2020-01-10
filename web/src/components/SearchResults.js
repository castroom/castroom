import React, { Component } from "react";
import "../styles/SearchResults.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null
    };
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.title !== prevProps.title) {
      this.setState({
        title: this.props.title
      })
    }
  }

  // TODO: need to re-render the component when the props change
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
        {this.props.title}
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