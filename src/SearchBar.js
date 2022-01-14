import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const SearchBar = ({ className, searchCallback, suggestionCallback, placeholderText, fontAwesomeIcon }) => {
  const [searchString, setSearchString] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSelection, setActiveSelection] = useState(-1);
  const inputElement = useRef(null);
  const [isCloseIcon, setIsCloseIcon] = useState(false);
  const closeIcon = ["fas", "times"];

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
    }
  });

  function handleMouseDown(e) {
    console.log("mousedown target:", e.target);
  }
  function handleMouseOver(e) {
    console.log("mouseover target:", e.target);
  }

  const handleInputChange = async (newInput) => {
    setSearchString(newInput);
    if (newInput && newInput.length > 0) {
      try {
        const suggestions = await suggestionCallback(newInput);
        setSuggestions(suggestions);
      } catch (error) { setSuggestions([]) } //since suggestions aren't that important, just set them to empty on an error
    } else {
      setSuggestions([]);
    }
  }

  const handleSearch = (searchString) => {
    setSearchString(searchString);
    setSuggestions([]);
    if (searchString && searchString.length > 0) {
      searchCallback(searchString);
    }
    inputElement.current.blur();
  }

  const handleKeyDown = (key) => {
    switch (key) {
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
    switch (key) {
      case 'Enter':
        if (activeSelection > -1) {
          handleSearch(suggestions[activeSelection]);
        } else {
          if (suggestions && suggestions[0]) {
            handleSearch(suggestions[0]);
          } else {
            handleSearch(searchString);
          }
        }
        break;
      default:
        break;
    }
  }

  const handleInputFocus = () => {
    handleInputChange(searchString)
  }

  const handleInputBlur = () => {
    setSuggestions([]);
    setActiveSelection(-1);
    setIsCloseIcon(false);
  }

  const handleButtonClick = () => {
    if (!isCloseIcon) {
      inputElement.current.focus();
    } else {
      inputElement.current.blur();
    }
    setIsCloseIcon(!isCloseIcon);
  }

  return (
    <div className={className}>
      <div className="boxAndIcon">
        <button onMouseDown={(e) => { e.preventDefault() }} onClick={() => { handleButtonClick() }} >
          <FontAwesomeIcon
            icon={isCloseIcon ? closeIcon : fontAwesomeIcon} size="lg" />
        </button>
        <div className="search-box" onMouseOut={() => setActiveSelection(-1)}>
          <form action="." onSubmit={(e) => { e.preventDefault() }}>
            <input
              tabIndex={-1}
              ref={inputElement}
              type="search"
              className="search-input"
              placeholder={placeholderText}
              value={searchString}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e.key)}
              onBlur={() => handleInputBlur()}
              onFocus={() => handleInputFocus()}
              onKeyDown={(e) => handleKeyDown(e.key)}
              onMouseOver={() => setActiveSelection(-1)}
            />
          </form>
          {suggestions && suggestions.length > 0 && <div className={"input-suggestion blank"}></div>}
          {suggestions && suggestions.length > 0 && suggestions.map((suggestion, index) => (
            <div
              className={index === activeSelection ? "input-suggestion-active" : "input-suggestion"}
              id={"suggestion" + index}
              key={index}
              onMouseOver={() => setActiveSelection(index)}
              onMouseDown={() => handleSearch(suggestion)}>{suggestion}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar