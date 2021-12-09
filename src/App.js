import React, { useState, useCallback } from "react";
import SideBar from "./SideBar";
import "./App.css"
import MemoizedGraph from "./MemoizedGraph";
import { getArtistById, getArtistByName, getRelatedArtistGraph, getSpotifySuggestions } from "./Api"

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [graphInitialArtist, setGraphInitialArtist] = useState(null);
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(1);
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
        <SideBar
          artistInFocus={artistInFocus}
          artistInFocusError={artistInFocusError}
          toggleClickCallback={toggleDegreesOfSeparation}
          searchCallback={handleSearch}
          searchSuggestionCallback={getSpotifySuggestions}
          searchPlaceholderText={"Search for an Artist to Create a Graph"} />
        <div className="graph">
          <MemoizedGraph initialArtist={graphInitialArtist} graph={graph} nodeSelectCallback={handleGetArtistById}></MemoizedGraph>
        </div>
      </div>
    );
  }
}

export default App;
