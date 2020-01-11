import React, { Component } from "react";
import "../styles/SearchBar.scss";
import Container from "react-bootstrap/Container";
import Autosuggest from "react-autosuggest";
import axios from "axios";


function singleRequestCreator() {
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
          console.log("Error: ", thrown.message);
      }
    });
  }
}
var get = singleRequestCreator();


class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // When suggestion is clicked, replace the input field with the track name
  getSuggestionValue = suggestion => suggestion._source.trackName;

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({ value }) => {
    const res = get(`https://api.castroom.co/?q=${value}`);
    res.then(response => {
      this.setState({
        suggestions: response || []
      });
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onEnter(suggestion._source);
  }

  renderSuggestion = suggestion => (
    <div className="suggestion">
      <span className="suggestionName">{suggestion._source.trackName}</span><br/>
      <span className="suggestionArtist">{suggestion._source.artistName}</span>
      <span className="suggestionNumEpisodes">
        {suggestion._source.trackCount} Episode{suggestion._source.trackCount > 1 ? "s" : ""}
      </span>
    </div>
  );

  render() {
    const { value, suggestions } = this.state;

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
        padding: 20,
        paddingLeft: 30,
        border: 0,
        outlineWidth: 0,
        backgroundColor: "#f8f8f8"
      },
      suggestionHighlighted: {
        color: "blue"
      },
      suggestionsContainerOpen: {
        width: "100%",
        border: "1px solid #f8f8f8",
        backgroundColor: "#f8f8f8",
        borderRadius: 7,
        zIndex: 2,
        marginTop: 5,
        paddingBottom: 10,
      },
      suggestion: {
        margin: 30,
        fontWeight: 600,
      }
    };

    return (
      <Container className="searchBar" fluid={true}>
        <Autosuggest
          theme={theme}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </Container>
    );
  }
}

export default SearchBar;