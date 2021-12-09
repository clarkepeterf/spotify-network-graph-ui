import React, { useMemo } from "react";
import PeterGraph from "./PeterGraph"

const MemoizedGraph = ({ initialArtist, graph, artistSelectedCallback, windowResizeCallback  }) => {

    const peterGraph = useMemo(() => {

        return (
            <PeterGraph initialArtist={initialArtist} graph={graph} artistSelectedCallback={artistSelectedCallback} windowResizeCallback={windowResizeCallback}  />
        );
    }, [initialArtist, graph, artistSelectedCallback, windowResizeCallback]);

    return peterGraph;
}

export default MemoizedGraph;
