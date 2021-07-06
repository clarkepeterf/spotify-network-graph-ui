import React, {useMemo} from "react";
import PeterGraph from "./PeterGraph"

const MemoizedGraph = ({initialArtist, graph, nodeSelectCallback}) => {

    const peterGraph = useMemo(() => {

        return(
            <PeterGraph initialArtist={initialArtist} graph={graph} nodeSelectCallback={nodeSelectCallback} />
        );
    }, [initialArtist, graph, nodeSelectCallback]);

    return peterGraph;
}

export default MemoizedGraph;