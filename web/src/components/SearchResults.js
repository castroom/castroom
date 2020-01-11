import React, { Component } from "react";
import "../styles/SearchResults.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import scrollToComponent from 'react-scroll-to-component';

class SearchResults extends Component {

  componentDidUpdate() {
    scrollToComponent(this.summary, { offset: 0, align: "top", duration: 250, ease:"inSine"});
  }

  renderArtwork = () => {
    if (this.props.podcast.artwork) {
      return (
        <div>
          <img src={this.props.podcast.artwork} className="artwork" width="100%" alt="Artwork"></img><br/>
          <button className="viewOnItunesButton" onClick={() => {
          // open the iTunes link in a new tab
          window.open(
            this.props.podcast.iTunesLink,
            '_blank'
          );
        }}>View on iTunes</button>
        </div>
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
              <div className="artist">by: {this.props.podcast.artist}</div> 
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

  renderEpisode = (episode) => {
    var dateOptions = { year: "numeric", month: "short", day: "numeric" };
    var episodeLength = Math.floor(episode.duration / 60);

    // add the episode number to the title if it exists
    var title;
    if (episode.episode) {
      title = `${episode.episode}: ${episode.title}`;
    } else {
      title = episode.title;
    }
    
    return (
      <div key={episode.guid} className="episode">
        <div className="episodeDate">{episode.published.toLocaleDateString("en-US", dateOptions)}</div>
        <div className="episodeTitle">{title}</div>
        <div className="episodeDescription">{episode.description}</div>
        <button className="episodePlayButton" onClick={() => {
          // open the audio in a new tab
          window.open(
            episode.enclosure.url,
            '_blank'
          );
        }}>&#9654; {episodeLength} mins</button>
      </div>
    )
  }

  renderEpisodeSection = () => {
    if (this.props.podcast.episodes.length > 0) {

      const episodeItems = this.props.podcast.episodes.map((ep) => this.renderEpisode(ep) );
      return (episodeItems)
    }
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