import React, { useState, useCallback } from "react";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import "./App.css"
import MemoizedGraph from "./MemoizedGraph";
import { getArtistById, getArtistByName, getRelatedArtistGraph, getSpotifySuggestions } from "./Api"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch, faPlus, faTimes);

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [graphInitialArtist, setGraphInitialArtist] = useState(null);
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(2);
  const [artistInFocus, setArtistInFocus] = useState(null);
  const [artistInFocusError, setArtistInFocusError] = useState(null);

  const toggleDegreesOfSeparation = () => {
    degreesOfSeparation === 1 ? setDegreesOfSeparation(2) : setDegreesOfSeparation(1);
  }

  const handleGetArtistById = useCallback(async (id) => {
    try {
      const artist = await getArtistById(id, setArtistInFocus, setError);
      setArtistInFocus(artist);
    } catch (error) {
      setArtistInFocusError(`Failed to get artist with id: ${id}`);
    }
  }, []);

  const handleSearch = async (searchString) => {
    try {
      const relatedArtistGraph = await getRelatedArtistGraph(searchString, degreesOfSeparation);
      setGraph(relatedArtistGraph);
      const artist = await getArtistByName(searchString);
      setArtistInFocus(artist);
      setGraphInitialArtist(artist);
    } catch (error) {
      setError(error)
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div className="app">
        {/* <SearchBar className="createSearch" searchCallback={handleSearch} suggestionCallback={getSpotifySuggestions} placeholderText={"Search Artist to Create Graph"}></SearchBar> */}
        <div className="graph">
          <MemoizedGraph initialArtist={graphInitialArtist} graph={graph} artistSelectedCallback={handleGetArtistById}></MemoizedGraph>
        </div>
      </div>
    );
  }
}

export default App;
