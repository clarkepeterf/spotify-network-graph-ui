import Graph from "react-graph-vis";
import React, { useState } from "react";
import SearchBar from './SearchBar';
import ToggleSwitch from './ToggleSwitch';
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
      bold: true,
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
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(1);

  function getRelatedArtists(searchString) {
    fetch("http://localhost:8080?searchString=" + searchString + "&degreesOfSeparation=" + degreesOfSeparation)
    .then(res => res.json())
    .then(
      (result) => {
        setGraph(result);
        console.log(JSON.stringify(result));
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
      console.log("Selected nodes:");
      console.log(nodes);
      console.log("Selected edges:");
      console.log(edges);
      alert("Selected node: " + nodes);
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
      <div class="app">
        <h1 class="header">Spotify Network Graph</h1>
        <div>Graph Size:</div>
        <span>small</span><ToggleSwitch onClick={() => degreesOfSeparation === 1 ? setDegreesOfSeparation(2) : setDegreesOfSeparation(1)}></ToggleSwitch><span>large</span>
        <div class="search-and-graph-table">
          <div class="search-and-graph-row">
            <div class="search-bar">
              <SearchBar getRelatedArtists={getRelatedArtists}></SearchBar>
            </div>
            <div class="graph">
              <Graph key={uuidv4()} graph={graph} options={options} events={events}  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
