
import React, { useState, useEffect } from 'react'
import NewWindow from 'react-new-window'
import Graph from "react-graph-vis";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Compare = (props) => {
    const [selectedMeasure, setSelectedMeasure] = useState();
    const [selectedGlobal, setSelectedGlobal] = useState();
    const [selectedLocal, setSelectedLocal] = useState();
    const [selectedIndividual, setSelectedIndividual] = useState();

    const [network, setNetwork] = useState();

    const [networks, setNetworks] = useState([]);
    const [graphs, setGraphs] = useState([]);
  
  console.log("graphs", graphs)

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
  
 
    // 0 default
    // 1 Degree Centrality
    // 2 Closeness Centrality
    // 3 Betweenness Centrality

  const graphBuilder = (currNetwork, mode) => {
    console.log("mode", mode)
    const newGraph =  { id: currNetwork.id, nodes: [], edges: [] };
      for (const node of currNetwork.nodes) {
        let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: null }
        switch(mode) {
          case "degree_centrality":
            graphNode.value = node.cvalues.d;
            break;
          case "closeness_centrality":
            graphNode.value = node.cvalues.c;
            break;
          case "betweenness_centrality":
            graphNode.value = node.cvalues.b;
            break;
          default:
            graphNode.value = 10;
        }
        newGraph.nodes.push(graphNode);
      }
      newGraph.edges = currNetwork.edges;
      

      if(graphs.length > 0) {
        setGraphs(prevState => prevState.map(
          data => data.id !== currNetwork.id ? data : newGraph))
      }
      else {
        setGraphs(prevState => [...prevState, newGraph])
      }
     
      

    }

  useEffect(() => {
    const compareList = props.compareList;
    // #TBD: Get networks from DB by comapreList id's
     
        const nodes = [
            { id: 1, label: "Node 1", title: "node 1 tootip text", shape: 'dot', cvalues: { d: 10, b: 43, c: 5  }},
            { id: 2, label: "Node 2", title: "node 2 tootip text",shape: 'dot', cvalues: { d: 23, b: 3, c: 50  }},
            { id: 3, label: "Node 3", title: "node 3 tootip text",shape: 'dot', cvalues: { d: 54, b: 4, c: 7  }},
            { id: 4, label: "Node 4", title: "node 4 tootip text",shape: 'dot', cvalues: { d: 1, b: 56, c: 10  }},
            { id: 5, label: "Node 5", title: "node 5 tootip text",shape: 'dot' ,cvalues: { d: 3, b: 2, c: 22  }},
        ]
        const edges = [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 4, to: 5 },
        ]
        const data = [
          {id: 1, title: 'Network 1', description: '1111', nodes, edges },
          {id: 2, title: 'Network 1', description: '2222', nodes, edges },
          {id: 3, title: 'Network 1', description: '3333', nodes, edges },
        ]
        setNetworks(data);
        data.forEach( (item, index) => {
          graphBuilder(item)
        });

  }, []);

  useEffect(() => {
    networks.forEach( (item, index) => {
      graphBuilder(item, selectedGlobal)
    });

}, [selectedGlobal]);

useEffect(() => {
  networks.forEach( (item, index) => {
    graphBuilder(item, selectedLocal)
  });

}, [selectedLocal]);

useEffect(() => {
  networks.forEach( (item, index) => {
    graphBuilder(item, selectedIndividual)
  });

}, [selectedIndividual]);




  const eachNetwork = (item, index) => {
    return  (
              <Box sx={{  display: 'flex',flexDirection: 'column',  justifyContent: 'center', width: '45vw',  height: '40vh', backgroundColor: '#f5f5f5', border: '1px #dddddd solid'}} >
                <Typography>Network 1</Typography>
                { graphs[index] &&  <Graph style={{width: '100%', height: '90%'}} graph={graphs[index]} options={options} events={events} getNetwork={network => { setNetwork(network); }}/> }
              </Box>
    )
  };

    return (
        <NewWindow features={{ width: 900, height: 900,}} title="Networks Comparison">
            <Box sx={{ m: 4 }}>
              <Box>
                <Box sx={{ mt: 2}} >
                    <Typography>Measure Type:</Typography>
                    <ToggleButtonGroup color="primary" value={selectedMeasure} exclusive onChange={(e, value) => setSelectedMeasure(value)} >
                        <ToggleButton  sx={{ textTransform: 'none' }} value="global measures">Global Measures</ToggleButton>
                        <ToggleButton  sx={{ textTransform: 'none' }} value="local measures">Local Measures</ToggleButton>
                        <ToggleButton  sx={{ textTransform: 'none' }} value="individual measures">Individual Measures</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mt: 2}} >
                  { selectedMeasure === "global measures" &&
                  <>
                      <Typography>Global Measure Type:</Typography>
                      <ToggleButtonGroup color="primary" value={selectedGlobal} exclusive onChange={(e, value) => setSelectedGlobal(value)} >
                          <ToggleButton  sx={{ textTransform: 'none' }} value="shortest psth">Shortest Path</ToggleButton>
                          <ToggleButton  sx={{ textTransform: 'none' }} value="radius">Radius</ToggleButton>
                          <ToggleButton  sx={{ textTransform: 'none' }} value="diameter">Diameter</ToggleButton>
                      </ToggleButtonGroup>
                  </>
                  }

                  { selectedMeasure === "local measures" &&
                  <>
                      <Typography>Local Measure Type:</Typography>
                      <ToggleButtonGroup color="primary" value={selectedLocal} exclusive onChange={(e, value) => setSelectedLocal(value)} >
                          <ToggleButton  sx={{ textTransform: 'none' }} value="clustering">Clustering</ToggleButton>
                          <ToggleButton  sx={{ textTransform: 'none' }} value="transitivity">Transitivity</ToggleButton>
                          <ToggleButton  sx={{ textTransform: 'none' }} value="reciprocity">Reciprocity</ToggleButton>
                      </ToggleButtonGroup>
                  </>
                  }

                  { selectedMeasure === "individual measures" &&
                  <>
                      <Typography>Individual Measure Type:</Typography>
                      <ToggleButtonGroup color="primary" value={selectedIndividual} exclusive onChange={(e, value) => setSelectedIndividual(value)} >
                          <ToggleButton  sx={{ textTransform: 'none' }} value="degree_centrality">Degree Centrality</ToggleButton>
                          <ToggleButton  sx={{ textTransform: 'none' }} value="closeness_centrality">Closeness Centrality</ToggleButton>
                          <ToggleButton  sx={{ textTransform: 'none' }} value="betweenness_centrality">Betweenness Centrality</ToggleButton>
                      </ToggleButtonGroup>
                  </>
                  }
                </Box>
              </Box>
              
              <Box sx={{  display: 'flex', flexDirection: 'row',  flexWrap: 'wrap', mt: 4, }}>
                    { networks.map(eachNetwork) }
              </Box>
            </Box>
        </NewWindow>
    )
}
export default Compare;