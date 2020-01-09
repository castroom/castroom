import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Search from "./Search";
import SearchResults from "./SearchResults";
import "../styles/Website.scss";

class Website extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     podcastData: {}
  //   }
  // }
  
  // handleSearchCompletion(data) {
  //   console.log(data);
  //   this.setState({
  //     podcastData: data
  //   })
  // }

  render() {
    return (
      <Container className="website">
        <Row>
          <Search />
        </Row>
        <Row>
          <SearchResults/>
        </Row>
      </Container>
    )
  }
}

export default Website;
