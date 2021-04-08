import React, {useMemo} from "react";
import Graph from "react-graph-vis";

const MemoizedGraph = ({graph, nodeSelectCallback}) => {

    const graphComponent = useMemo(() => {

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
        
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
        
          const events = {
            select: ({ nodes, edges }) => {
              //do something when a node is selected
              if(nodes && nodes[0]){
                console.log(nodes);
                nodeSelectCallback(nodes[0]);
              }
            }
          }
        return(
            <Graph key={uuidv4()} graph={graph} options={options} events={events}  />
        );
    }, [graph, nodeSelectCallback]);

    return graphComponent;
}

export default MemoizedGraph;