
import React, { useState, useEffect } from 'react'
import Graph from "react-graph-vis";


const VisGraph = (props) => {
    
    const [network, setNetwork] = useState();

    console.log(props.graph)
    
    const options = {
        layout: {
            hierarchical: false
            },
            edges: {
                color: "#000000",
                smooth:{
                    enabled: true
                }
        },
        autoResize: true,
        

        
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
        <Graph style={{width: '100%', height: '90%'}} graph={props.graph} options={options} events={events} getNetwork={network => { setNetwork(network); }}/>
    )
}
export default VisGraph;