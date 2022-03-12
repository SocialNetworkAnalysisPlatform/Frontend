
import React, { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable';
import { makeStyles } from '@mui/styles';
import Graph from "react-graph-vis";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


const useStyles = makeStyles({
    toggleBtn: {
        textTransform: 'none !important',
        '&.Mui-selected': {
            color: '#6366f1 !important',
        },
    },
    autoComplete: {
        "& label.Mui-focused": {
            color: '#6366f1 !important'
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: '#6366f1 !important'
            }
        },
    }
  });

const ProjectNetwork = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const [network, setNetwork] = useState();

    const [networkData, setNetworkData] = useState();
    const [graph, setGraph] = useState();

    const [selectedMeasure, setSelectedMeasure] = useState('global measures');
    const [selectedGlobal, setSelectedGlobal] = useState();
    const [selectedLocal, setSelectedLocal] = useState();
    const [selectedIndividual, setSelectedIndividual] = useState();

    const [sourceNode, setSourceNode] = useState();
    const [targetNode, setTargetNode] = useState();

    const nodeRef = React.useRef(null);

    useEffect(() => {
        // #TBD: Get network from DB by if*
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
            const data = 
              {id: 1, title: 'Network 1', description: '1111', nodes, edges, GlobalMeasure:{ radius: { key: 2, value: 5 }, diameter: { key: 1, value: 10 } } }
            
            
            setNetworkData(data);
            graphBuilder(data);
      }, []);
  
  // 0 default
  // 1 Degree Centrality
  // 2 Closeness Centrality
  // 3 Betweenness Centrality

  const graphBuilder = (currNetwork, mode, path=null) => {
    const newGraph =  { id: currNetwork.id, title: currNetwork.title, nodes: [], edges: []};
      for (const node of currNetwork.nodes) {
        let graphNode = { id: node.id , label: node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
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
            case "radius":
                if(node.id == currNetwork.GlobalMeasure.radius.key) {
                    graphNode.color = 'green'
                    break;
                }
                break;
            case "diameter":
                if(node.id == currNetwork.GlobalMeasure.diameter.key) {
                    graphNode.color = 'red'
                    break;
                }
                break;
            case "shortest path":
                console.log(path)
                if(path && path.includes(node.label)) {
                    graphNode.color = 'pink'
                    break;
                }
                break;
          default:
        }
        newGraph.nodes.push(graphNode);
      }
      newGraph.edges = currNetwork.edges;
      

        setGraph(newGraph)
     
      

    }
    

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
        interaction: {
            zoomView: false
        }

    
    };

    const events = {
        select: function(event) {
        var { nodes, edges } = event;

        },
    };

    useEffect(() => {
        if(networkData) {
            graphBuilder(networkData, selectedGlobal)
        }
      }, [selectedGlobal]);
    
    useEffect(() => {
        if(networkData) {
            graphBuilder(networkData, selectedLocal)
        }
    }, [selectedLocal]);
    
    useEffect(() => {
        if(networkData) {
            graphBuilder(networkData, selectedIndividual)
        }
    }, [selectedIndividual]);


    const searchShortestPath = () => {
        if(sourceNode && targetNode) {
            // Compute shortest paths in the graph.
        }
        let path = ['Node 1', 'Node 2', 'Node 3']
        graphBuilder(networkData, 'shortest path', path)

    }
    

    const zoomIn = () => {
        const zoomInScale = network.getScale() + 0.5
        network.moveTo({
            scale: zoomInScale,
            offset: {x: 0, y: 0},
            animation: {duration: 1000, easingFunction: "easeInOutQuad"}
        })
    }

    const zoomOut = () => {
        const zoomInScale = network.getScale() - 0.5
        if(zoomInScale > 0) {
        network.moveTo({
            scale: zoomInScale,
            offset: {x: 0, y: 0},
            animation: {duration: 1000, easingFunction: "easeInOutQuad"}
        })
        }
    }
  


    return (
        <Box sx={{position: 'relative'}}>
            <Stack direction={'column'} gap={1} position={'absolute'} zIndex={'1'} > 
                <IconButton onClick={zoomIn} color="default" size="large" sx={{ backgroundColor: '#F5F5F5', color: '#6366f1'}}>
                    <AddIcon/>
                </IconButton>
                <IconButton onClick={zoomOut} color="default" size="large" sx={{ backgroundColor: '#F5F5F5', color: '#6366f1'}}>
                    <RemoveIcon/>
                </IconButton>
            </Stack>
            
            <Draggable nodeRef={nodeRef} bounds="parent">
                <Box ref={nodeRef} sx={{ align: 'right', width: 320, backgroundColor: '#F5F5F5', p: 1, position: 'absolute', zIndex: 1, right: 0}}> 
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={{ color: '#6366f1' }}>SNAP Analysis</Typography>
                        <IconButton onClick={() => setExpanded(!expanded)}>
                            { expanded ? <CloseFullscreenIcon/> : <OpenInFullIcon/> }
                        </IconButton>
                    </Stack>
                    
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Stack direction={'column'} >
                            <ToggleButtonGroup sx={{ mb: 2 }} color="primary" value={selectedMeasure} exclusive onChange={(e, value) => setSelectedMeasure(value)} >
                                <ToggleButton className={classes.toggleBtn} value="global measures">Global Measures</ToggleButton>
                                <ToggleButton className={classes.toggleBtn} value="local measures">Local Measures</ToggleButton>
                                <ToggleButton  className={classes.toggleBtn} value="individual measures">Individual Measures</ToggleButton>
                            </ToggleButtonGroup>
                            { selectedMeasure === "global measures" &&
                                <ToggleButtonGroup color="primary" value={selectedGlobal} exclusive onChange={(e, value) => setSelectedGlobal(value)} >
                                    <ToggleButton className={classes.toggleBtn} value="shortest path">Shortest Path</ToggleButton>
                                    <ToggleButton  className={classes.toggleBtn} value="radius">
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
                            }

                            { selectedMeasure === "global measures" && selectedGlobal === "shortest path" &&
                                <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
                                    <Autocomplete disablePortal options={networkData.nodes} onChange={(event, value) => setSourceNode(value)} 
                                    renderInput={(params) => <TextField {...params} className={classes.autoComplete} size="small" variant="outlined" label='Source node' /> }
                                    />
                                    <Autocomplete disablePortal options={networkData.nodes} onChange={(event, value) => setTargetNode(value)} 
                                    renderInput={(params) => <TextField {...params} className={classes.autoComplete} size="small" variant="outlined" label='Target node'/>}
                                    />
                                    <Button onClick={searchShortestPath} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 80, textTransform: "none",}} > Search </Button>
                                </Stack>
                            }

                            { selectedMeasure === "local measures" &&
                                <ToggleButtonGroup color="primary" value={selectedLocal} exclusive onChange={(e, value) => setSelectedLocal(value)} >
                                    <ToggleButton className={classes.toggleBtn} value="clustering">Clustering</ToggleButton>
                                    <ToggleButton className={classes.toggleBtn} value="transitivity">Transitivity</ToggleButton>
                                    <ToggleButton className={classes.toggleBtn} value="reciprocity">Reciprocity</ToggleButton>
                                </ToggleButtonGroup>
                            }

                            { selectedMeasure === "individual measures" &&
                                <ToggleButtonGroup color="primary" value={selectedIndividual} exclusive onChange={(e, value) => setSelectedIndividual(value)} >
                                    <ToggleButton className={classes.toggleBtn} value="degree_centrality">Degree Centrality</ToggleButton>
                                    <ToggleButton className={classes.toggleBtn} value="closeness_centrality">Closeness Centrality</ToggleButton>
                                    <ToggleButton className={classes.toggleBtn} value="betweenness_centrality">Betweenness Centrality</ToggleButton>
                                </ToggleButtonGroup>
                            }
                        </Stack>
                    </Collapse>
                </Box>
            </Draggable>

            <Box sx={{ width: '100%', height: '70vh'}}>
                { graph && <Graph style={{width: '99%', height: '100%'}} graph={graph} options={options} events={events} getNetwork={network => { setNetwork(network); }}/> }
            </Box>
        </Box>
    )

}
export default ProjectNetwork;
