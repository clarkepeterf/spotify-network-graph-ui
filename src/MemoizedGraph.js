import React from "react";
import Graph from "react-graph-vis";

function graphIsEqual(prevGraph, nextGraph){
    console.log("comparing graphs");
    console.log(prevGraph);
    console.log(nextGraph);
    console.log("done comparing graphs");
    return true;

}

export const GraphWrapper = ({key, graph, options, events}) => {
    return(
        <Graph key={key} graph={graph} options={options} events={events}  />
    );
}

export const MemoizedGraph = React.memo(GraphWrapper, graphIsEqual);