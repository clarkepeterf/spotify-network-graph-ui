import React, { useState, useCallback} from "react";
import SideBar from "./SideBar";
import "./App.css"
import MemoizedGraph from "./MemoizedGraph";
import {getArtistById} from "./Api"

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({nodes: [], edges: []});
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(1);
  const [artistInFocus, setArtistInFocus] = useState(null);
  const [artistInFocusError, setArtistInFocusError] = useState(null);
  const [sideBarHidden, setSideBarHidden] = useState(false);

  function toggleDegreesOfSeparation(){
    degreesOfSeparation === 1 ? setDegreesOfSeparation(2) : setDegreesOfSeparation(1);
  }

  const handleGetArtistById = useCallback(async (id) => {
    try {
      const artist = await getArtistById(id, setArtistInFocus, setError);
      setArtistInFocus(artist);
    } catch(error){
      setArtistInFocusError(`Failed to get artist with id: ${id}`);
    }
  }, []);

  function getArtist(name){
    fetch(encodeURI(`http://localhost:8080/artist?name=${name}`))
    .then(res => res.json())
    .then(
      (result) => {
        setArtistInFocus(result);
      },
      (error) => {
        setArtistInFocusError(error);
      }
    );
  }

  function getRelatedArtists(searchString) {
    fetch(encodeURI(`http://localhost:8080?searchString=${searchString}&degreesOfSeparation=${degreesOfSeparation}`))
    .then(res => res.json())
    .then(
      (result) => {
        setGraph(result);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setError(error);
      }
    )
  }

  function handleSearch(searchString) {
    getRelatedArtists(searchString);
    getArtist(searchString);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return(
      <div className={sideBarHidden ? "app-hide-side" : "app"}>
        <SideBar sideBarHidden={sideBarHidden} setSideBarHidden={setSideBarHidden} artistInFocus={artistInFocus} artistInFocusError={artistInFocusError} toggleClickCallback={toggleDegreesOfSeparation} searchCallback={handleSearch}/>
        <div className="graph">
          <MemoizedGraph graph={graph} nodeSelectCallback={handleGetArtistById}></MemoizedGraph>
        </div>
      </div>
    );
  }
}

export default App;
