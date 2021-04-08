import React, { useState, useCallback} from "react";
import SideBar from './SideBar';
import MemoizedGraph from './MemoizedGraph';
import './App.css'

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({nodes: [], edges: []});
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(2);
  const [artistInFocus, setArtistInFocus] = useState(null);

  function toggleDegreesOfSeparation(){
    degreesOfSeparation === 1 ? setDegreesOfSeparation(2) : setDegreesOfSeparation(1);
  }


  const getArtistById = useCallback((id) => {
    fetch("http://localhost:8080/artist/" + id)
    .then(res => res.json())
    .then(
      (result) => {
        setArtistInFocus(result);
        console.log(result);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setError(error);
      }
    )
  }, []);

  function getRelatedArtists(searchString) {
    fetch("http://localhost:8080?searchString=" + searchString + "&degreesOfSeparation=" + degreesOfSeparation)
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

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return(
      <div className="app">
        <div className="app-table">
          <div className="app-row">
            <SideBar artistInFocus={artistInFocus} toggleClickCallback={toggleDegreesOfSeparation} searchCallback={getRelatedArtists}/>
            <div className="graph">
              {/* TODO: not sure if Memoized Graph is needed, trying to find a way to not re-render when non-graph state is updated */}
              <MemoizedGraph graph={graph} nodeSelectCallback={getArtistById}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
