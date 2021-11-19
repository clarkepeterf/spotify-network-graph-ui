import React, { useMemo } from "react";
import PeterGraph from "./PeterGraph"

const MemoizedGraph = ({ initialArtist, graph, nodeSelectCallback, windowResizeCallback }) => {

    const peterGraph = useMemo(() => {

        return (
            <PeterGraph initialArtist={initialArtist} graph={graph} nodeSelectCallback={nodeSelectCallback} windowResizeCallback={windowResizeCallback} />
        );
    }, [initialArtist, graph, nodeSelectCallback, windowResizeCallback]);

    return peterGraph;
}

export default MemoizedGraph;