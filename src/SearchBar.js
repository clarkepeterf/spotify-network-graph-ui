import React, {useState} from 'react';
import './SearchBar.css';

const SearchBar = ({getRelatedArtists}) => {
  const [searchString, setSearchString] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  function handleInputChange(searchString){
    setSuggestions(spotifySearch(searchString));
    setSearchString(searchString);
  }

  function spotifySearch(searchString){
    fetch("http://localhost:8080/search?q=" + searchString)
    .then(res => res.json())
    .then(
      (result) => {
        setSuggestions(result);
      },
      (error) => {
        setSuggestions([]);
      }
    );
  }

  function handleGetRelatedArtists(searchString){
    setSearchString(searchString);
    setSuggestions([]);
    getRelatedArtists(searchString);
  }
  return (
    <div>
        <div class="search-box">
          <input
          class="search-input" 
          placeholder={"search artist"}
          value={searchString}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleGetRelatedArtists(searchString) : null}
          />
          {suggestions && suggestions.map((suggestion, index) => (
            <div class="input-suggestion" id={index} key={index} onClick={() => handleGetRelatedArtists(suggestion)}>{suggestion}</div>
            ))}
        </div>
    </div>

  );
}

export default SearchBar