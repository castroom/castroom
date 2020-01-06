import React, { Component } from "react";
import "../styles/SearchBar.scss";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import Autosuggest from "react-autosuggest";
import axios from "axios";


function makeRequestCreator() {
  var call;
  return function(url) {
      if (call) {
          call.cancel();
      }
      call = axios.CancelToken.source();
      return axios.get(url, { cancelToken: call.token }).then((response) => {
          return response.data.hits
      }).catch(function(thrown) {
          if (axios.isCancel(thrown)) {
              console.log('First request canceled', thrown.message);
          } else {
              // handle error
          }
      });
  }
}
var get = makeRequestCreator();

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div className="suggestion">
    <span className="suggestionName">{suggestion._source.trackName}</span><br/>
    <span className="suggestionArtist">{suggestion._source.artistName}</span>
    <span className="suggestionNumEpisodes">
      {suggestion._source.trackCount} Episode{suggestion._source.trackCount > 1 ? "s" : ""}
    </span>
  </div>
);

class SearchBar extends Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({ value }) => {
    // const result = await axios.get(`https://api.castroom.co/?q=${value}`);
    // console.log(result.data.hits);
    const res = get(`https://api.castroom.co/?q=${value}`);
    console.log(res.then(response => {
      console.log(response);
      this.setState({
        suggestions: response || []
      });
    }));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "ex: Freakonomics",
      value,
      onChange: this.onChange
    };
    
    const theme = {
      input: {
        width: "100%",
        borderRadius: 7,
        height: 70,
        // textAlign: "center"
        padding: 20,
        paddingLeft: 30,
        border: 0,
        outlineWidth: 0,
        backgroundColor: "pink"
      },
      suggestionsContainerOpen: {
        width: "100%",
        border: "1px solid #aaa",
        backgroundColor: "#fff",
        borderRadius: 7,
        zIndex: 2,
        marginTop: 5,
        paddingBottom: 10
      },
      suggestionFirst: {
        color: "blue"
      },
      suggestion: {
        // padding: 10,
        margin: 30,
        // padding: 10,
      }
    };

    return (
      <Container className="searchBar" fluid={true}>
        <Autosuggest
          theme={theme}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </Container>
    );
  }
}

export default SearchBar;