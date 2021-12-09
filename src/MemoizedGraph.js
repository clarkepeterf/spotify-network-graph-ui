import React, { useMemo } from "react";
import PeterGraph from "./PeterGraph"

const MemoizedGraph = ({ initialArtist, graph, artistSelectedCallback }) => {

    const peterGraph = useMemo(() => {

        return (
            <PeterGraph initialArtist={initialArtist} graph={graph} artistSelectedCallback={artistSelectedCallback} />
        );
    }, [initialArtist, graph, artistSelectedCallback]);

    return peterGraph;
}

export default MemoizedGraph;