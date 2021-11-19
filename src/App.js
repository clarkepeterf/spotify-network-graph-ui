import React, { useState, useCallback, useEffect, useRef } from "react";
import SideBar from "./SideBar";
import "./App.css"
import MemoizedGraph from "./MemoizedGraph";
import { getArtistById, getArtistByName, getRelatedArtistGraph } from "./Api"

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [graphInitialArtist, setGraphInitialArtist] = useState(null);
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(1);
  const [artistInFocus, setArtistInFocus] = useState(null);
  const [artistInFocusError, setArtistInFocusError] = useState(null);
  //network and container used to resize the vis.js canvas
  const network = useRef(null);
  const container = useRef(null);


  const windowResizeCallback = (graphNetwork, graphContainer) => {
    network.current = graphNetwork;
    container.current = graphContainer;
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return _ => {
      window.removeEventListener('resize', handleResize);
    }
  });

  const handleResize = () => {
    network.current && container.current && network.current.setSize(container.current.clientWidth, container.current.clientHeight);
    if (graphInitialArtist) {
      //For some reason the graph sometimes disappears on resize, but if we move the graph it reappears. 'Move' central node to it's current position.
      const position = network.current.getPosition(graphInitialArtist.id);
      network.current && container.current && network.current.moveNode(graphInitialArtist.id, position.x, position.y);
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
        <SideBar artistInFocus={artistInFocus} artistInFocusError={artistInFocusError} toggleClickCallback={toggleDegreesOfSeparation} searchCallback={handleSearch} />
        <div className="graph">
          <MemoizedGraph initialArtist={graphInitialArtist} graph={graph} nodeSelectCallback={handleGetArtistById} windowResizeCallback={windowResizeCallback}></MemoizedGraph>
        </div>
      </div>
    );
  }
}

export default App;
