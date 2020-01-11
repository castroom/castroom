import React, { Component } from "react";
import "../styles/Search.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
// import podcastFeedParser from "podcast-feed-parser";
import parsePodcast from "node-podcast-parser";
import axios from "axios";
import logo from "../logo.png";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      description: null,
      artwork: null,
      artist: null,
      episodes: [],
      iTunesLink: null,
    }
  }

  async handleSearchCompletion(data) {
    axios.get(`https://cors-anywhere.herokuapp.com/${data.feedUrl}`).then(response => {
      parsePodcast(response.data, (err, response) => {
        if (err) {
            alert("Error Retrieving Podcasts - Castroom doesn't currently support podcasts hosted on FeedBurner")
            console.error("Parsing error", err);
            return;
        }

        this.setState({
          title: data.trackName,
          description: response.description.long,
          artwork: data.artworkUrl600,
          artist: data.artistName,
          episodes: response.episodes,
          iTunesLink: data.trackViewUrl
        })
        
        console.log("Data", response);
      });
    });
  }

  render() {
    return (
      <Container className="search" fluid={true}>
        <div className="searchBarWrapper">
          <Row>
            <Col sm={12}>
              <div className="searchMessage">
                <img src={logo} width="340px" alt="logo"></img>
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
        </div>
        <Row>
          <Col sm={12}>
            <SearchResults podcast={this.state}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;