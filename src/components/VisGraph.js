
import React, { useState, useEffect } from 'react'
import Graph from "react-graph-vis";


const VisGraph = (props) => {
    
    const [network, setNetwork] = useState();
    
    const options = {
        layout: {
            randomSeed: 1,
            hierarchical: false,    
            improvedLayout: false,   
        },
        nodes: {
            shape: 'dot',
            color: '#6366f1',
            font: {
                size: 12,
                face: "Calibri"
            }
        },
        edges: {
            smooth: {
                enabled: true,
                type: "continuous",
                forceDirection: "none",
                roundness: 0.5
            },
        },
        autoResize: true,
        interaction: {
            zoomView: true
        },
        physics: {
        enabled: true,
        hierarchicalRepulsion: {
            avoidOverlap: 0.8,
            springConstant: 0.001,
            nodeDistance: 100,
            damping: 1.5
        },
        stabilization: {
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true
        },
        solver: 'hierarchicalRepulsion'
    },
    };

  

    const events = {
        select: function(event) {
        var { nodes, edges } = event;

        },
        stabilized: () => {
            if (network) { // Network will be set using getNetwork event from the Graph component
                network.setOptions({ physics: false }); // Disable physics after stabilization
                network.fit();
            }
        }
    };
  
 

    return (
        <Graph style={{width: '100%', height: '100%'}} key={props.graph.id} graph={props.graph} options={options} events={events} getNetwork={network => { setNetwork(network); }}/>
    )
}
export default VisGraph;