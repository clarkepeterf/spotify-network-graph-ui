import React, {useState} from 'react';
import './SearchBar.css';
import {getSpotifySuggestions} from './Api';

const SearchBar = ({searchCallback}) => {
  const [searchString, setSearchString] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSelection, setActiveSelection] = useState(-1);
  
  const handleInputChange = async (newInput) => {
    setSearchString(newInput);
    if(newInput && newInput.length > 0){
      try{
        const suggestions = await getSpotifySuggestions(newInput);
        setSuggestions(suggestions);
      } catch(error){ setSuggestions([])} //since suggestions aren't that important, just set them to empty on an error
    } else{
      setSuggestions([]);
    }
  }

  const handleGetRelatedArtists = (searchString) => {
    setSearchString(searchString);
    setSuggestions([]);
    if(searchString && searchString.length > 0){
      searchCallback(searchString);
    }
  }
  
  const handleKeyDown = (key) => {
    switch(key){
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        activeSelection < suggestions.length - 1 ? setActiveSelection(activeSelection + 1) : setActiveSelection(activeSelection)
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        activeSelection > -1 ? setActiveSelection(activeSelection - 1) : setActiveSelection(activeSelection)
        break;
      default:
        break;
    }
  }

  const handleKeyPress = (key) => {
    console.log(key);
    switch(key){
      case 'Enter':
        activeSelection > -1 ? handleGetRelatedArtists(suggestions[activeSelection]) : handleGetRelatedArtists(searchString)
        break;
      default:
        break;
    }
  }

  const handleBlur = () => {
    setSuggestions([]);
    setActiveSelection(-1);
  }

  return (
        <div className="search-box" onMouseOut={() => setActiveSelection(-1)}>
          <input
          className="search-input" 
          placeholder={"Search for an Artist"}
          value={searchString}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e.key)}
          onBlur={() => handleBlur()}
          onFocus={() => handleInputChange(searchString)}
          onKeyDown={(e) => handleKeyDown(e.key)}
          onMouseOver={() => setActiveSelection(-1)}
          />
          {suggestions && suggestions.length > 0 && suggestions.map((suggestion, index) => (
            <div
              className={index === activeSelection ? "input-suggestion-active" : "input-suggestion"}
              id={"suggestion" + index}
              key={index}
              onMouseOver={() => setActiveSelection(index)}
              onMouseDown={() => handleGetRelatedArtists(suggestion)}>{suggestion}</div>
            ))}
        </div>
  );
}

export default SearchBar