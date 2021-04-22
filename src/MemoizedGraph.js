import React, {useMemo} from "react";
import PeterGraph from "./PeterGraph"

const MemoizedGraph = ({graph, nodeSelectCallback}) => {

    const peterGraph = useMemo(() => {

        return(
            <PeterGraph graph={graph} nodeSelectCallback={nodeSelectCallback} />
        );
    }, [graph, nodeSelectCallback]);

    return peterGraph;
}

export default MemoizedGraph;