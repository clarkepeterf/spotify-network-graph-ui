const networkOptions = {
    layout: {
        hierarchical: false,
        improvedLayout: false,
    },
    clickToUse: false,
    edges: {
        arrows: {
            to: {
                enabled: false,
            }
        },
        color: {
            color: "#7299fc",
            highlight: "#fc9972",
            hover: "#7299fc",
        },
        smooth: {
            type: 'continuous',
            roundness: 0.5,
        }
    },
    nodes: {
        font: {
            bold: "true",
            color: "#fcfcfc",
        },
        shape: "circularImage",
    },
    physics: {
        barnesHut: {
            avoidOverlap: 1,
            gravitationalConstant: -50000,
        }
    }
};

export { networkOptions };