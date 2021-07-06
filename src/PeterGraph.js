import React, { useEffect, useRef } from "react";
import {DataSet, Network} from "vis-network/standalone";
import "./PeterGraph.css";

const PeterGraph = ({graph, nodeSelectCallback}) => {
    const container = useRef(null);
    const nodes = new DataSet(graph.nodes);
    
    const edges = new DataSet(graph.edges);
    
    // create a network
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
            const {nodes, pointer} = doubleClickEvent;
            if(nodes && nodes.length === 1 && pointer){
                const x = Math.round(pointer.canvas.x);
                const y = Math.round(pointer.canvas.y);
                updateGraph(nodes[0], x, y);
            }
        })
        network.setSize(container.current.clientWidth, container.current.clientHeight);
    });
    
    const updateGraph = (id, x, y) =>{
        fetch(`http://localhost:8080/update?id=${id}&x=${x}&y=${y}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({nodes: nodes.get(), edges: edges.get()})
        })
        .then(res => res.json())
        .then(
            (result) => {
                result.nodes && nodes.add(result.nodes);
                result.edges && edges.add(result.edges);
            },
            (error) => {
            console.log(error);
            }
      )
    }
    return(
        <div className="PeterGraph" id="mynetwork" ref={container}>Graph</div>
    );
}

export default PeterGraph;