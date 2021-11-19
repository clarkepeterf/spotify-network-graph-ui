import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "./PeterGraph.css";
import { updateRelatedArtistGraph } from "./Api";

const PeterGraph = ({ graph, nodeSelectCallback }) => {
  const container = useRef(null);
  const nodes = new DataSet(graph.nodes);

  const edges = new DataSet(graph.edges);

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
      color: "#7299fc",
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
    network.on("selectNode", (selectNodeEvent) => {
      nodeSelectCallback(selectNodeEvent.nodes[0]);
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
  });

  const updateGraph = async (id, x, y) => {
    try {
      const updates = await updateRelatedArtistGraph(nodes.get(), edges.get, id, x, y);
      updates.nodes && nodes.add(updates.nodes);
      updates.edges && edges.add(updates.edges);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="PeterGraph" id="mynetwork" ref={container}>Graph</div>
  );
}

export default PeterGraph;
