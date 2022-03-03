
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import Graph from "react-graph-vis";


const useStyles = makeStyles({
 
  });

const ProjectNetwork = (props) => {
    const classes = useStyles();
    

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
        // <Graph style={{width: '100%', height: '90%'}} getNetwork={network => { setNetwork(network); }}/>
        <div></div>
    )

}
export default ProjectNetwork;
