import Graph from "react-graph-vis";
import React, { useState } from "react";
import SearchBar from './SearchBar';

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
      gravitationalConstant: -100000
    }
  }
};

const App = () => {

  const [error, setError] = useState(null);
  const [graph, setGraph] = useState(null);

  function getRelatedArtists(searchString) {
    fetch("http://localhost:8080?searchString=" + searchString + "&degreesOfSeparation=2")
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
  } else if (graph) {
    return(
      <div id="root">
      <h1>Spotify Network Graph</h1>
      <SearchBar getRelatedArtists={getRelatedArtists}></SearchBar>
      <Graph key={uuidv4()} graph={graph} options={options} events={events}  />
    </div>
    );
  } else {
    return (
      <div>
        <h1>Spotify Network Graph</h1>
        <SearchBar getRelatedArtists={getRelatedArtists}></SearchBar>
      </div>
    );
  }
}

export default App;
