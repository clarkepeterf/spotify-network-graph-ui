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
  const prevContainerWidthRef = useRef(0);
  const prevContainerHeightRef = useRef(0);
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const setEmbedArtistRef = useRef(null);
  const setEmbedContainerHeightRef = useRef(null);
  const setMenuOpenRef = useRef(null);
  const graphDataSets = {
    nodes: new DataSet([]),
    edges: new DataSet([]),
  };
  const numberOfStepsRef = useRef(null)


  function storeEmbedStateRefs(artistFunc, containerHeightFunc) {
    setEmbedArtistRef.current = artistFunc
    setEmbedContainerHeightRef.current = containerHeightFunc
  }

  function storeSetMenuOpenRef(menuOpenFunc) {
    setMenuOpenRef.current = menuOpenFunc
  }

  function setNumberOfStepsRef(numberOfSteps) {
    numberOfStepsRef.current = numberOfSteps
  }

  const artistTrie = new ArtistTrie()

  function highlightArtistWithName(name) {
    const artist = artistTrie.get(name)
    if (artist && networkRef.current) {
      networkRef.current.selectNodes([artist.id]);
      setEmbedContainerHeightRef.current(containerRef.current.clientHeight)
      setEmbedArtistRef.current(artist)
      const focusOptions = {
        scale: 1.5
      };
      networkRef.current.focus(artist.id, focusOptions);
    }
  }

  useEffect(() => {
    const network = new Network(containerRef.current, graphDataSets, networkOptions);
    networkRef.current = network;
    network.on("selectNode", (selectNodeEvent) => {
      const nodes = selectNodeEvent.nodes;
      if (nodes && nodes.length === 1) {
        const selectedArtist = graphDataSets.nodes.get(nodes[0])
        setEmbedContainerHeightRef.current(containerRef.current.clientHeight)
        setEmbedArtistRef.current(selectedArtist)
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

  async function handleResize(event) {
    networkRef.current && networkRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight) && networkRef.current.fit();
    containerRef.current && setEmbedContainerHeightRef.current(containerRef.current.clientHeight)
  }

  function convertArtistToNode(artist) {
    const images = artist.images
    return {
      id: artist.id,
      label: artist.name,
      image: images.length > 0 ? images[images.length - 1].url : "https://upload.wikimedia.org/wikipedia/commons/2/25/Icon-round-Question_mark.jpg",
    }
  }

  async function addRelatedArtists(artistId, degreesOfSeparation) {

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

  function convertArtistToNodeWithXY(artist, x, y) {
    return {
      ...convertArtistToNode(artist),
      x: x,
      y: y,
    }
  }

  function addNode(node) {
    const existingNode = graphDataSets.nodes.get(node.id)
    if (!existingNode) {
      graphDataSets.nodes.add(node)
      artistTrie.add(node)
    }

  }

  async function handleSearch(searchString) {
    const initialArtist = await getArtistByName(searchString);
    const initialNode = convertArtistToNode(initialArtist);
    addNode(initialNode);
    addRelatedArtists(initialArtist.id, numberOfStepsRef.current).then(() => {
      networkRef.current.selectNodes([initialArtist.id]);
      setEmbedContainerHeightRef.current(containerRef.current.clientHeight)
      setEmbedArtistRef.current(initialArtist)
    });
  }

  function clearGraph() {
    graphDataSets.edges.clear()
    graphDataSets.nodes.clear()
    artistTrie.clear()
    setEmbedArtistRef.current(null)
  }

  return (
    <div className="graph-wrapper">
      <header className="header-wrapper">
        <h1 className="header-audio">audio</h1><h1 className="header-graph">graph</h1>
      </header>
      <Menu storeSetOpenCallBack={storeSetMenuOpenRef} setNumberOfStepsCallback={setNumberOfStepsRef} />
      <button className="menu-button" title="Open Menu" onClick={() => { setMenuOpenRef.current(true) }}><FontAwesomeIcon icon={["fas", "bars"]} size="lg" /></button>
      <SearchBar className={"addToGraph"} searchCallback={handleSearch} suggestionCallback={getSpotifySuggestions} placeholderText={"Add Artist"} fontAwesomeIcon={["fas", "plus"]}></SearchBar>
      <SearchBar className={"inGraphSearch"} searchCallback={highlightArtistWithName} suggestionCallback={(query) => { return artistTrie.search(query) }} placeholderText={"Search Graph"} fontAwesomeIcon={["fas", "search"]} />
      <button className="fit-button" title="Fit Graph" onClick={() => { networkRef.current.fit() }}><FontAwesomeIcon icon={["fas", "compress-alt"]} size="lg" /></button>
      <button className="reset-button" title="Clear Graph" onClick={clearGraph}><FontAwesomeIcon icon={["fas", "times"]} size="lg" /></button>
      <SpotifyEmbed storeSetStateCallback={storeEmbedStateRefs} />
      <div className="PeterGraph" id="mynetwork" ref={containerRef}>Graph</div>
    </div>
  );
}

