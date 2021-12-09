import React, { useState, useCallback, useRef, useEffect } from "react";
import SideBar from "./SideBar";
import "./App.css"
import MemoizedGraph from "./MemoizedGraph";
import { getArtistById, getArtistByName, getRelatedArtistGraph, getSpotifySuggestions } from "./Api"

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [graphInitialArtist, setGraphInitialArtist] = useState(null);
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(2);
  const [artistInFocus, setArtistInFocus] = useState(null);
  const [artistInFocusError, setArtistInFocusError] = useState(null);
  //network and container used to resize the vis.js canvas
  const network = useRef(null);
  const container = useRef(null);
  const windowWidthRef = useRef(0);
  const windowHeightRef = useRef(0);


  const windowResizeCallback = (graphNetwork, graphContainer) => {
    network.current = graphNetwork;
    container.current = graphContainer;
  }

  useEffect(() => {
    windowWidthRef.current = window.clientWidth;
    windowHeightRef.current = window.clientHeight;
    window.addEventListener('resize', handleResize);
    return _ => {
      window.removeEventListener('resize', handleResize);
    }
  });

  const handleResize = () => {
    console.log("hello");
    //only resize the graph if the window has actually changed size
    if ((window.clientWidth !== windowWidthRef.current) || (window.clientHeight !== windowWidthRef.current)) {
      console.log("previous width:", windowWidthRef.current);
      console.log("current width:", window.clientWidth);
      console.log("previous height:", windowHeightRef.current);
      console.log("current height:", window.clientHeight);
      network.current && container.current && network.current.setSize(container.current.clientWidth, container.current.clientHeight);
      if (graphInitialArtist) {
        //For some reason the graph sometimes disappears on resize, but if we move the graph it reappears. 'Move' central node to it's current position.
        const position = network.current.getPosition(graphInitialArtist.id);
        network.current && container.current && network.current.moveNode(graphInitialArtist.id, position.x, position.y);
      }
    }
  }

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
          searchPlaceholderText={"Search Artist to Create a Graph"} />
        <div className="graph">
          <MemoizedGraph initialArtist={graphInitialArtist} graph={graph} artistSelectedCallback={handleGetArtistById} windowResizeCallback={windowResizeCallback}></MemoizedGraph>
        </div>
      </div>
    );
  }
}

export default App;
