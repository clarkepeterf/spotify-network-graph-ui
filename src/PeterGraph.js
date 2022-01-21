import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "./PeterGraph.css";
import { getRelatedArtists, getArtistByName, getSpotifySuggestions } from "./Api";
import SearchBar from "./SearchBar";
import { networkOptions } from "./NetworkOptions"
import SpotifyEmbed from "./SpotifyEmbed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "./Menu"

const PeterGraph = () => {
  const prevContainerWidthRef = useRef(0);
  const prevContainerHeightRef = useRef(0);
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const setArtistRef = useRef(null);
  const setContainerHeightRef = useRef(null);
  const setMenuOpenRef = useRef(null);
  const graphDataSets = {
    nodes: new DataSet([]),
    edges: new DataSet([]),
  };
  const numberOfStepsRef = useRef(null)

  function storeSetStateRefs(artistFunc, containerHeightFunc) {
    setArtistRef.current = artistFunc
    setContainerHeightRef.current = containerHeightFunc
  }

  function storeSetMenuOpenRef(menuOpenFunc) {
    setMenuOpenRef.current = menuOpenFunc
  }

  function setNumberOfStepsRef(numberOfSteps) {
    numberOfStepsRef.current = numberOfSteps
  }

  const trie =
  {
    children: {},
    value: null,
  };

  const updateTrie = (artist) => {
    let node = trie;
    for (const char of artist.label) {
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
  };

  const getArtistsWithPrefix = (prefix) => {
    // Always get based on lowercase letters (trie expects lower case letters)
    const lowerCasePrefix = prefix.toLowerCase();
    const results = [];
    const startNode = getTrieNodeWithPrefix(lowerCasePrefix);
    collectValuesMatchingPrefix(startNode, lowerCasePrefix, results);
    // Limit results to 20
    if (results.length > 20) {
      return results.slice(0, 20)
    } else return results;
  }

  const getTrieNodeWithPrefix = (prefix) => {
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
      results.push(node.value.label);
    }
    const childKeys = Object.keys(node.children);
    for (const char of childKeys) {
      const newPrefix = prefix + char;
      collectValuesMatchingPrefix(node.children[char], newPrefix, results);
    }
  }

  const highlightArtistWithName = (name) => {
    const trieNode = getTrieNodeWithPrefix(name);
    if (trieNode.value && trieNode.value.id && networkRef.current) {
      networkRef.current.selectNodes([trieNode.value.id]);
      setContainerHeightRef.current(containerRef.current.clientHeight)
      setArtistRef.current(trieNode.value)
      const focusOptions = {
        scale: 1.5
      };
      networkRef.current.focus(trieNode.value.id, focusOptions);
    }
  }

  useEffect(() => {
    const network = new Network(containerRef.current, graphDataSets, networkOptions);
    networkRef.current = network;
    network.on("selectNode", (selectNodeEvent) => {
      const nodes = selectNodeEvent.nodes;
      if (nodes && nodes.length === 1) {
        const selectedArtist = graphDataSets.nodes.get(nodes[0])
        setContainerHeightRef.current(containerRef.current.clientHeight)
        setArtistRef.current(selectedArtist)
      }
    })
    network.on("doubleClick", (doubleClickEvent) => {
      const nodes = doubleClickEvent.nodes;
      if (nodes && nodes.length === 1) {
        addRelatedArtists(nodes[0], 1).then(() => {
          networkRef.current.selectNodes([nodes[0]]);
        });
      }
    })
    network.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
  });

  useEffect(() => {
    prevContainerWidthRef.current = containerRef.current.clientWidth;
    prevContainerHeightRef.current = containerRef.current.clientHeight;
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  const handleResize = async (event) => {
    console.log("prev:", { width: prevContainerWidthRef, height: prevContainerHeightRef })
    console.log("curr:", { width: containerRef.current.clientWidth, height: containerRef.current.clientHeight })
    if (containerRef.current.clientWidth !== prevContainerWidthRef.current || containerRef.current.clientHeight !== prevContainerHeightRef.current) {
      networkRef.current && networkRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight) && networkRef.current.fit();
      containerRef.current && setContainerHeightRef.current(containerRef.current.clientHeight)
    }
  }

  const convertArtistToNode = (artist) => {
    const images = artist.images
    return {
      id: artist.id,
      label: artist.name,
      image: images.length > 0 ? images[images.length - 1].url : "https://upload.wikimedia.org/wikipedia/commons/2/25/Icon-round-Question_mark.jpg",
    }
  }

  const addRelatedArtists = async (artistId, degreesOfSeparation) => {
    if (degreesOfSeparation > 0) {
      const { x, y } = networkRef.current.getPosition(artistId);
      const relatedArtists = await getRelatedArtists(artistId);
      for (const relatedArtist of relatedArtists) {
        const relatedNode = convertArtistToNodeWithXY(relatedArtist, x, y)
        addNode(relatedNode)
        graphDataSets.edges.add({
          from: artistId,
          to: relatedArtist.id,
        })
        addRelatedArtists(relatedArtist.id, degreesOfSeparation - 1)
      }
    }
  }

  const convertArtistToNodeWithXY = (artist, x, y) => {
    return {
      ...convertArtistToNode(artist),
      x: x,
      y: y,
    }
  }

  const addNode = (node) => {
    const existingNode = graphDataSets.nodes.get(node.id)
    if (!existingNode) {
      graphDataSets.nodes.add(node)
    }
    updateTrie(node)
  }

  const handleSearch = async (searchString) => {
    const initialArtist = await getArtistByName(searchString);
    const initialNode = convertArtistToNode(initialArtist);
    addNode(initialNode);
    addRelatedArtists(initialArtist.id, numberOfStepsRef.current).then(() => {
      networkRef.current.selectNodes([initialArtist.id]);
      setContainerHeightRef.current(containerRef.current.clientHeight)
      setArtistRef.current(initialArtist)
    });
  }

  function clearGraph() {
    graphDataSets.edges.clear()
    graphDataSets.nodes.clear()
    // trie.children = {}
    setArtistRef.current(null)
  }

  return (
    <div className="graph-wrapper">
      <header className="header-wrapper">
        <h1 className="header-audio">audio</h1><h1 className="header-graph">graph</h1>
      </header>
      <Menu storeSetOpenCallBack={storeSetMenuOpenRef} setNumberOfStepsCallback={setNumberOfStepsRef} />
      <button className="menu-button" title="Open Menu" onClick={() => { setMenuOpenRef.current(true) }}><FontAwesomeIcon icon={["fas", "bars"]} size="lg" /></button>
      <SearchBar className={"addToGraph"} searchCallback={handleSearch} suggestionCallback={getSpotifySuggestions} placeholderText={"Add Artist"} fontAwesomeIcon={["fas", "plus"]}></SearchBar>
      <SearchBar className={"inGraphSearch"} searchCallback={highlightArtistWithName} suggestionCallback={getArtistsWithPrefix} placeholderText={"Search Graph"} fontAwesomeIcon={["fas", "search"]} />
      <button className="fit-button" title="Fit Graph" onClick={() => { networkRef.current.fit() }}><FontAwesomeIcon icon={["fas", "compress-alt"]} size="lg" /></button>
      <button className="reset-button" title="Clear Graph" onClick={clearGraph}><FontAwesomeIcon icon={["fas", "times"]} size="lg" /></button>
      <SpotifyEmbed storeSetStateCallback={storeSetStateRefs} />
      <div className="PeterGraph" id="mynetwork" ref={containerRef}>Graph</div>
    </div>
  );
}

export default PeterGraph;
