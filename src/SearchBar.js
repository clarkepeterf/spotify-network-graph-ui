import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function SearchBar({ className, searchCallback, suggestionCallback, placeholderText, fontAwesomeIcon, startOpen }) {
  const [searchString, setSearchString] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSelection, setActiveSelection] = useState(-1);
  const inputElement = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const buttonElement = useRef(null);

  useEffect(() => {
    if (startOpen) {
      buttonElement.current.click()
    }
  }, [startOpen])

  async function handleInputChange(newInput) {
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

  function handleSearch(searchString) {
    setSearchString(searchString);
    setSuggestions([]);
    if (searchString && searchString.length > 0) {
      searchCallback(searchString);
    }
    inputElement.current.blur();
  }

  function handleKeyDown(key) {
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

  function handleKeyPress(key) {
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

  function handleInputFocus() {
    handleInputChange(searchString)
  }

  function handleInputBlur() {
    setSuggestions([]);
    setActiveSelection(-1);
    setIsOpen(false);
  }

  function handleButtonClick() {
    if (!isOpen) {
      inputElement.current.focus();
    } else {
      inputElement.current.blur();
    }
    setIsOpen(!isOpen);
  }

  return (
    <div className={className}>
      <div className="boxAndIcon">
        <button className="button" ref={buttonElement} title={placeholderText} onMouseDown={(e) => { e.preventDefault() }} onClick={() => { handleButtonClick() }} >
          <FontAwesomeIcon
            icon={fontAwesomeIcon} size="lg" />
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