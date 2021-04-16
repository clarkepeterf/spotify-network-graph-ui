import React, {useState} from 'react';
import './SearchBar.css';

const SearchBar = ({searchCallback}) => {
  const [searchString, setSearchString] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  function handleInputChange(searchString){
    setSearchString(searchString);
    if(searchString && searchString.length > 0){
      spotifySearch(searchString);
    } else{
      setSuggestions([]);
    }
  }

  function spotifySearch(searchString){
    fetch(`http://localhost:8080/search?q=${searchString}`)
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
    if(searchString && searchString.length > 0){
      searchCallback(searchString);
    }
  }
  return (
    <div>
        <div className="search-box">
          <input
          className="search-input" 
          placeholder={"search artist"}
          value={searchString}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? handleGetRelatedArtists(searchString) : null}
          />
          {suggestions && suggestions.length > 0 && suggestions.map((suggestion, index) => (
            <div className="input-suggestion" id={index} key={index} onClick={() => handleGetRelatedArtists(suggestion)}>{suggestion}</div>
            ))}
        </div>
    </div>

  );
}

export default SearchBar