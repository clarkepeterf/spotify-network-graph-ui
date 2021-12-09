import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "./PeterGraph.css";
import { updateRelatedArtistGraph } from "./Api";
import SearchBar from "./SearchBar";

const PeterGraph = ({ graph, artistSelectedCallback }) => {
  const container = useRef(null);
  const networkRef = useRef(null);
  const nodes = new DataSet(graph.nodes);

  const edges = new DataSet(graph.edges);

  const trie =
  {
    children: {},
    value: null,
  };

  const updateTrie = (artists) => {
    for (const artist of artists) {
      let node = trie;
      for (const char of artist.title) {
        // Always add with lower case letters
        //When searching tree we will also convert to lowercase to make searching case insensitive
        const lowerChar = char.toLowerCase();
        if (!(lowerChar in node.children)) {
          node.children[lowerChar] =
          {
            children: {},
            value: null,
          }
        }
        node = node.children[lowerChar];
      }
      node.value = artist;
    }
  };

  const getArtistsWithPrefix = (prefix) => {
    // Always get based on lowercase letters (trie expects lower case letters)
    const lowerCasePrefix = prefix.toLowerCase();
    const results = [];
    const startNode = getNodeWithPrefix(lowerCasePrefix);
    collectValuesMatchingPrefix(startNode, lowerCasePrefix, results);
    console.log({ results });
    // Limit results to 20
    if (results.length > 20) {
      return results.slice(0, 20)
    } else return results;
  }

  const getNodeWithPrefix = (prefix) => {
    // Always get based on lower case letters (trie expects lower case letters)
    const lowerCasePrefix = prefix.toLowerCase();
    let node = trie;
    for (const char of lowerCasePrefix) {
      if (char in node.children) {
        node = node.children[char]
      } else {
        return null;
      }
    }
    return node;
  }

  const collectValuesMatchingPrefix = (node, prefix, results) => {
    if (node === null) {
      return;
    }
    if (node.value !== null) {
      results.push(node.value.title);
    }
    const childKeys = Object.keys(node.children);
    for (const char of childKeys) {
      const newPrefix = prefix + char;
      collectValuesMatchingPrefix(node.children[char], newPrefix, results);
    }
  }

  const highlightArtistWithName = (name) => {
    const node = getNodeWithPrefix(name);
    if (node.value && node.value.id && networkRef.current) {
      networkRef.current.selectNodes([node.value.id]);
      const focusOptions = {
        scale: 1.5
      };
      artistSelectedCallback(node.value.id);
      networkRef.current.focus(node.value.id, focusOptions);
    }
  }

  const data = {
    nodes: nodes,
    edges: edges
  };
  const options = {
    layout: {
      hierarchical: false,
      improvedLayout: false
    },
    clickToUse: false,
    edges: {
      arrows: {
        to: {
          enabled: false
        }
      },
      color: {
        color: "#7299fc",
        highlight: "#fc9972",
        hover: "#7299fc",
      },
      smooth: {
        type: 'continuous',
        roundness: 0.5
      }
    },
    nodes: {
      font: {
        bold: "true",
        color: "#fcfcfc"
      }
    },
    physics: {
      barnesHut: {
        avoidOverlap: 1,
        gravitationalConstant: -50000,
      }
    }
  };

  useEffect(() => {
    const network = new Network(container.current, data, options);
    networkRef.current = network;
    network.on("selectNode", (selectNodeEvent) => {
      artistSelectedCallback(selectNodeEvent.nodes[0]);
    });
    network.on("doubleClick", (doubleClickEvent) => {
      const { nodes, pointer } = doubleClickEvent;
      if (nodes && nodes.length === 1 && pointer) {
        const x = Math.round(pointer.canvas.x);
        const y = Math.round(pointer.canvas.y);
        updateGraph(nodes[0], x, y);
      }
    })
    network.setSize(container.current.clientWidth, container.current.clientHeight);
    updateTrie(graph.nodes);
  });

  const updateGraph = async (id, x, y) => {
    try {
      const updates = await updateRelatedArtistGraph(nodes.get(), edges.get(), id, x, y);
      updates.nodes && nodes.add(updates.nodes) && updateTrie(updates.nodes);
      updates.edges && edges.add(updates.edges);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="graph-wrapper">
      <SearchBar searchCallback={highlightArtistWithName} suggestionCallback={getArtistsWithPrefix} placeholderText={"Search Artists within the Graph"} />
      <div className="PeterGraph" id="mynetwork" ref={container}>Graph</div>
    </div>
  );
}

export default PeterGraph;
