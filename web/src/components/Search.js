import React, { Component } from "react";
import "../styles/Search.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
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
    // send the request through the server to prevent cors issues 
    // and issues with cors-anywhere + FeedBurner feeds not responding proper data
    axios.get(`https://castroom-api.herokuapp.com/feed?url=${data.feedUrl}`).then(response => {
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
    }).catch(err => {
      console.log(err);
      alert("Could not get podcast metadata")
    });
  }

  render() {
    return (
      <Container className="search" fluid={true}>
        <div className="searchBarWrapper">
          <Row>
            <Col md={12}>
              <div className="searchHeader">
                <img responsive src={logo} alt="logo"></img>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <SearchBar onEnter={(data) => this.handleSearchCompletion(data)}/>
            </Col>
            <Col md={2}></Col>
          </Row>
        </div>
        <Row>
          <Col md={12}>
            <SearchResults podcast={this.state}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;