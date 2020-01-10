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
      title: null
    }
  }

  async handleSearchCompletion(data) {
    this.setState({
      title: data.trackName,
    });

    axios.get(`https://cors-anywhere.herokuapp.com/${data.feedUrl}`).then(response => {
      console.log(response.data)
      parsePodcast(response.data, (err, data) => {
        if (err) {
            console.error("Parsing error", err);
            return;
        }
        
        console.log("Data", data);
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
            <SearchResults title={this.state.title}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;