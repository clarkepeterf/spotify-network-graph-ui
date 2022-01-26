import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "./Graph.css";
import { getRelatedArtists, getArtistByName, getSpotifySuggestions } from "./api";
import SearchBar from "./SearchBar";
import { networkOptions } from "./networkOptions"
import SpotifyEmbed from "./SpotifyEmbed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "./Menu"
import ArtistTrie from "./ArtistTrie";

export default function Graph() {
  const graphDataSets = {
    nodes: new DataSet([]),
    edges: new DataSet([]),
  };
  const artistTrie = new ArtistTrie()
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  let stopPhysicsTimeout = null;
  // The let variables below are set by child components of the graph
  let setEmbedArtist = null;
  let setEmbedContainerHeight = null;
  let setMenuOpen = null;
  let numberOfSteps = null;


  function storeEmbedStateFunctions(artistFunc, containerHeightFunc) {
    setEmbedArtist = artistFunc
    setEmbedContainerHeight = containerHeightFunc
  }

  function storeSetMenuOpenFunction(menuOpenFunc) {
    setMenuOpen = menuOpenFunc
  }

  function setNumberOfSteps(steps) {
    numberOfSteps = steps
  }

  useEffect(() => {
    const network = new Network(containerRef.current, graphDataSets, networkOptions);
    networkRef.current = network;
    network.on("selectNode", (selectNodeEvent) => {
      const nodes = selectNodeEvent.nodes;
      if (nodes && nodes.length === 1) {
        const selectedArtist = graphDataSets.nodes.get(nodes[0])
        setEmbedContainerHeight(containerRef.current.clientHeight)
        setEmbedArtist(selectedArtist)
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
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  async function handleResize(event) {
    networkRef.current && networkRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight) && networkRef.current.fit();
    containerRef.current && setEmbedContainerHeight(containerRef.current.clientHeight)
  }

  async function addRelatedArtists(artistId, degreesOfSeparation) {
    if (degreesOfSeparation > 0) {
      startPhysics()
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

  function startPhysics() {
    clearTimeout(stopPhysicsTimeout)
    networkRef.current.setOptions({
      physics: {
        enabled: true
      }
    })
  }

  function stopPhysicsAfterAnimation() {
    clearTimeout(stopPhysicsTimeout)
    stopPhysicsTimeout = setTimeout(() => {
      networkRef.current.setOptions({
        physics: {
          enabled: false
        }
      })
    }, 10000)
  }

  function convertArtistToNode(artist) {
    const images = artist.images
    return {
      id: artist.id,
      label: artist.name,
      image: images.length > 0 ? images[images.length - 1].url : "https://upload.wikimedia.org/wikipedia/commons/2/25/Icon-round-Question_mark.jpg",
    }
  }

  function convertArtistToNodeWithXY(artist, x, y) {
    return {
      ...convertArtistToNode(artist),
      x: x,
      y: y,
    }
  }

  function addNode(node) {
    stopPhysicsAfterAnimation()
    const existingNode = graphDataSets.nodes.get(node.id)
    if (!existingNode) {
      graphDataSets.nodes.add(node)
      artistTrie.add(node)
    }

  }

  async function handleSearch(searchString) {
    const initialArtist = await getArtistByName(searchString);
    setEmbedContainerHeight(containerRef.current.clientHeight)
    setEmbedArtist(initialArtist)
    const initialNode = convertArtistToNode(initialArtist);
    addNode(initialNode);
    addRelatedArtists(initialArtist.id, numberOfSteps).then(() => {
      networkRef.current.selectNodes([initialArtist.id]);
    });
  }

  function highlightArtistWithName(name) {
    const artist = artistTrie.get(name)
    if (artist && networkRef.current) {
      networkRef.current.selectNodes([artist.id]);
      setEmbedContainerHeight(containerRef.current.clientHeight)
      setEmbedArtist(artist)
      const focusOptions = {
        scale: 1.5
      };
      networkRef.current.focus(artist.id, focusOptions);
    }
  }

  function clearGraph() {
    graphDataSets.edges.clear()
    graphDataSets.nodes.clear()
    artistTrie.clear()
    setEmbedArtist(null)
  }

  return (
    <div className="graph-wrapper">
      <header className="header-wrapper">
        <h1 className="header-audio">audio</h1><h1 className="header-graph">graph</h1>
      </header>
      <Menu storeSetOpenCallBack={storeSetMenuOpenFunction} setNumberOfStepsCallback={setNumberOfSteps} />
      <button className="menu-button" title="Open Menu" onClick={() => { setMenuOpen(true) }}><FontAwesomeIcon icon={["fas", "bars"]} size="lg" /></button>
      <SearchBar className={"addToGraph"} searchCallback={handleSearch} suggestionCallback={getSpotifySuggestions} placeholderText={"Add Artist"} fontAwesomeIcon={["fas", "plus"]}></SearchBar>
      <SearchBar className={"inGraphSearch"} searchCallback={highlightArtistWithName} suggestionCallback={(query) => { return artistTrie.search(query) }} placeholderText={"Search Graph"} fontAwesomeIcon={["fas", "search"]} />
      <button className="fit-button" title="Fit Graph" onClick={() => { networkRef.current.fit() }}><FontAwesomeIcon icon={["fas", "compress-alt"]} size="lg" /></button>
      <button className="reset-button" title="Clear Graph" onClick={clearGraph}><FontAwesomeIcon icon={["fas", "times"]} size="lg" /></button>
      <SpotifyEmbed storeSetStateCallback={storeEmbedStateFunctions} />
      <div className="network" ref={containerRef} />
    </div>
  );
}

