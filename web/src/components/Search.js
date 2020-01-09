import React, { Component } from "react";
import "../styles/Search.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchBar from "./SearchBar";
import podcastFeedParser from "podcast-feed-parser";

class Search extends Component {

  async parseFeed(feedUrl) {
    return podcastFeedParser.getPodcastFromURL(feedUrl);
  }
  
  async handleSearchCompletion(data) {
    console.log(data);
    // var d = await this.parseFeed(data.feedUrl);
    var d = await this.parseFeed(`https://cors-anywhere.herokuapp.com/${data.feedUrl}`);
    console.log(d);
    console.log("done");
    // parse the feed url and send the data back in a structured format
  }

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
          <Col sm={2}></Col>
          <Col sm={8}>
            <SearchBar onEnter={(data) => this.handleSearchCompletion(data)}/>
          </Col>
          <Col sm={2}></Col>
        </Row>
      </Container>
    );
  }
}

export default Search;