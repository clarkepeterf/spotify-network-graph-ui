import React, { useState, useCallback} from "react";
import SideBar from './SideBar';
import './App.css'
import PeterGraph from "./PeterGraph";
import MemoizedGraph from "./MemoizedGraph";

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({nodes: [], edges: []});
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(1);
  const [artistInFocus, setArtistInFocus] = useState(null);
  const [sideBarHidden, setSideBarHidden] = useState(false);

  function toggleDegreesOfSeparation(){
    degreesOfSeparation === 1 ? setDegreesOfSeparation(2) : setDegreesOfSeparation(1);
  }

  const getArtistById = useCallback((id) => {
    fetch(`http://localhost:8080/artist/${id}`)
    .then(res => res.json())
    .then(
      (result) => {
        setArtistInFocus(result);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setError(error);
      }
    )
  }, []);

  function getArtist(name){
    fetch(`http://localhost:8080/artist?name=${name}`)
    .then(res => res.json())
    .then(
      (result) => {
        setArtistInFocus(result);
      },
      (error) => {
        //TODO: do something on error?
      }
    );
  }

  function getRelatedArtists(searchString) {
    fetch(`http://localhost:8080?searchString=${searchString}&degreesOfSeparation=${degreesOfSeparation}`)
    .then(res => res.json())
    .then(
      (result) => {
        console.log({result})
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

  function updateGraph(artistId) {
    console.trace({artistId})
    fetch(`http://localhost:8080/graph?id=${artistId}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graph),
    })
    .then(res => res.json())
    .then(
      (result) => {
      setGraph(result);
      },
      (error) => {
        setError(error);
      }
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return(
      <div className={sideBarHidden ? "app-hide-side" : "app"}>
        <SideBar sideBarHidden={sideBarHidden} setSideBarHidden={setSideBarHidden} artistInFocus={artistInFocus} toggleClickCallback={toggleDegreesOfSeparation} searchCallback={handleSearch}/>
        <div className="graph">
          <MemoizedGraph graph={graph} nodeSelectCallback={getArtistById}></MemoizedGraph>
        </div>
      </div>
    );
  }
}

export default App;
