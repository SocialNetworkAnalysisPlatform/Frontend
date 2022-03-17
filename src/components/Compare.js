
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles';
import { v4 as uuidv4 } from "uuid";
import NewWindow from 'react-new-window'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import VisGraph from './VisGraph'

const useStyles = makeStyles({
  toggleBtn: {
      textTransform: 'none !important',
      '&.Mui-selected': {
          color: '#6366f1 !important',
      },
  },
});

const Compare = (props) => {
  const classes = useStyles();
  const [selectedMeasure, setSelectedMeasure] = useState();
  const [selectedGlobal, setSelectedGlobal] = useState();
  const [selectedLocal, setSelectedLocal] = useState();
  const [selectedIndividual, setSelectedIndividual] = useState();

  const [networks, setNetworks] = useState([]);
  const [graphs, setGraphs] = useState([]);
  

  
  // 0 default
  // 1 Degree Centrality
  // 2 Closeness Centrality
  // 3 Betweenness Centrality

  const graphBuilder = (currNetwork, mode) => {
    let newGraph =  { id: uuidv4(), networkId: currNetwork.id, title: currNetwork.title, nodes: [], edges: [...currNetwork.edges]};
        
    // Reset edges color
    for (let j = 0; j < (newGraph.edges).length; j++) {   
        newGraph.edges[j].color = '#000000' 
    }
    
    switch(mode) {
        case "init": {
            for (const node of currNetwork.nodes) {
                let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: node.color} // default node
                newGraph.nodes.push(graphNode);
            } 
            break;
        }
        case "degree_centrality": {
            for (const node of currNetwork.nodes) {
                let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
                graphNode.value = node.cvalues.d;
                newGraph.nodes.push(graphNode);
            }
            break;
        }
        case "closeness_centrality": {
            for (const node of currNetwork.nodes) {
                let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
                graphNode.value = node.cvalues.c;
                newGraph.nodes.push(graphNode);
            }
            break;
        }
        case "betweenness_centrality": {
            for (const node of currNetwork.nodes) {
                let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
                graphNode.value = node.cvalues.b;
                newGraph.nodes.push(graphNode);
            }
            break;
        }
        case "radius": {
            for (const node of currNetwork.nodes) {
                let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
                if(node.id == currNetwork.GlobalMeasure.radius.key) {
                    graphNode.color = 'green'
                }
                newGraph.nodes.push(graphNode);
            }
            break;
        }
        case "diameter": {
            for (const node of currNetwork.nodes) {
                let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
                if(node.id == currNetwork.GlobalMeasure.diameter.key) {
                    graphNode.color = 'red'
                }
                newGraph.nodes.push(graphNode);
            }
            break;
        }
        // case "search_shortest_path": { 
        //     if(path) {
        //         // Colorize nodes
        //         for (const node of currNetwork.nodes) {
        //             let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
        //             if(path.includes(node.id)) {
        //                 graphNode.color = 'red'
        //             }
        //             newGraph.nodes.push(graphNode);
        //         }
        //         // Colorize edges
        //         for (let i = 0; i < path.length - 1; i++) {
        //             for (let j = 0; j < (newGraph.edges).length; j++) {   
        //                 // console.log(`path[i]: ${path[i]} == from: ${newGraph.edges[j].from} && path[i+1]: ${path[i+1]} == to: ${newGraph.edges[j].to}`)
        //                 if( (path[i] == newGraph.edges[j].from) && (path[i+1] == newGraph.edges[j].to) ) {
        //                     newGraph.edges[j].color = 'red'
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        //     break;
        // }       
    }    
      
      if(graphs.length > 0) {
        setGraphs(prevState => prevState.map(
          data => data.networkId !== currNetwork.id ? data : newGraph))
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
            {id: uuidv4(), title: 'Network 1', description: '1111', nodes, edges, GlobalMeasure:{ radius: { key: 2, value: 5 }, diameter: { key: 1, value: 10 } } },
            {id: uuidv4(), title: 'Network 2', description: '2222', nodes, edges, GlobalMeasure:{ radius: { key: 3, value: 5 }, diameter: { key: 5, value: 20 } } },
            {id: uuidv4(), title: 'Network 3', description: '3333', nodes, edges, GlobalMeasure:{ radius: { key: 4, value: 5 }, diameter: { key: 3, value: 30 } } },
          ]
          setNetworks(data);
          data.forEach( (item, index) => {
            graphBuilder(item, "init")
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
              <Box sx={{  display: 'flex',flexDirection: 'column', width: '45vw',  height: '40vh', backgroundColor: '#f5f5f5', border: '1px #dddddd solid'}} >
                <Typography sx={{ position: 'absolute', zIndex: 1 }}>{ item.title }</Typography>
                <VisGraph key={item.id} index={index} graph={item}></VisGraph>
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
                      <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="global measures">Global Measures</ToggleButton>
                      <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="local measures">Local Measures</ToggleButton>
                      <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="individual measures">Individual Measures</ToggleButton>
                  </ToggleButtonGroup>
              </Box>

              <Box sx={{ mt: 2}} >
                { selectedMeasure === "global measures" &&
                <>
                    <Typography>Global Measure Type:</Typography>
                    <ToggleButtonGroup color="primary" value={selectedGlobal} exclusive onChange={(e, value) => setSelectedGlobal(value)} >
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="shortest_path">Shortest Path</ToggleButton>
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="radius">
                        <Tooltip title="The radius is the minimum eccentricity." arrow>
                            <Typography>Radius</Typography>
                        </Tooltip>
                        </ToggleButton>
                          <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="diameter">
                            <Tooltip title="The diameter is the maximum eccentricity." arrow>
                              <Typography>Diameter</Typography>
                            </Tooltip>
                        </ToggleButton>

                    </ToggleButtonGroup>
                </>
                }

                { selectedMeasure === "local measures" &&
                <>
                    <Typography>Local Measure Type:</Typography>
                    <ToggleButtonGroup color="primary" value={selectedLocal} exclusive onChange={(e, value) => setSelectedLocal(value)} >
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="clustering">Clustering</ToggleButton>
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="transitivity">Transitivity</ToggleButton>
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="reciprocity">Reciprocity</ToggleButton>
                    </ToggleButtonGroup>
                </>
                }

                { selectedMeasure === "individual measures" &&
                <>
                    <Typography>Individual Measure Type:</Typography>
                    <ToggleButtonGroup color="primary" value={selectedIndividual} exclusive onChange={(e, value) => setSelectedIndividual(value)} >
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="degree_centrality">Degree Centrality</ToggleButton>
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="closeness_centrality">Closeness Centrality</ToggleButton>
                        <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="betweenness_centrality">Betweenness Centrality</ToggleButton>
                    </ToggleButtonGroup>
                </>
                }
              </Box>
            </Box>
            
            <Box sx={{  display: 'flex', flexDirection: 'row',  flexWrap: 'wrap', mt: 4, }}>
                  { graphs && graphs.map(eachNetwork) }
            </Box>
          </Box>
      </NewWindow>
  )
}
export default Compare;