import React, { Component } from "react";
import "../styles/SearchResults.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import scrollToComponent from 'react-scroll-to-component';

class SearchResults extends Component {

  componentDidUpdate() {
    scrollToComponent(this.summary, { offset: 0, align: "middle", duration: 250, ease:"inSine"});
  }

  renderArtwork = () => {
    if (this.props.podcast.artwork) {
      return (
        <img src={this.props.podcast.artwork} className="artwork" width="100%" alt="Artwork"></img>
      )
    }
    return null;
  }

  renderSummarySection = () => {
    if (this.props.podcast.title) {
      return (
        <div className="summaryWrapper">
          <div className="title">{this.props.podcast.title}</div> <br/>
          {
            this.props.podcast.artist ? 
              <div className="artist">by {this.props.podcast.artist}</div> 
            : null
          }
          <br/>
          {
            this.props.podcast.description ? 
            <div className="description" dangerouslySetInnerHTML={{__html: this.props.podcast.description}}></div>
            : null
          }
        </div>
      )
    } 
  }

  renderEpisodeSection = () => {
    return (
      <div>
        Episode Section
      </div>
    )
  }
  

  render() {
    if (this.props.podcast.title) {
      return (
        <Container className="searchResults" ref={(Container) => { this.summary = Container; }} fluid={true}>
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

    return null;
  }
}

export default SearchResults;