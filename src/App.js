import Graph from "react-graph-vis";
import React, { useState } from "react";
import SideBar from './SideBar';
import {MemoizedGraph} from './MemoizedGraph';
import './App.css'

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    arrows: {
      to: {
        enabled: false
      }
    },
    color: "#7299fc",
    smooth: {
      type: 'horizontal',
      roundness: 1
    }
  },
  nodes: {
    font: {
      bold: "true",
      color: "#121212"
    }
  },
  physics: {
    barnesHut: {
      avoidOverlap: 1,
      gravitationalConstant: -100000,
      damping: 1
    }
  }
};

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState({nodes: [], edges: []});
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(2);
  const [artistInFocus, setArtistInFocus] = useState(null);

  function toggleDegreesOfSeparation(){
    degreesOfSeparation === 1 ? setDegreesOfSeparation(2) : setDegreesOfSeparation(1);
  }


  function getArtistById(id){
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
  }

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
  const events = {
    select: ({ nodes, edges }) => {
      //do something when a node is selected
      if(nodes && nodes[0]){
        console.log(nodes);
        getArtistById(nodes[0]);
      }
    }
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
              <MemoizedGraph key={uuidv4()} graph={graph} options={options} events={events}  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
