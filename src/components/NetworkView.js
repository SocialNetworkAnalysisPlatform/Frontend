
import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from "uuid";
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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

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
    },
    sliderInput: {
        "&.MuiInput-underline:after": {
            borderBottomColor: '#6366f1'
        }
    }
  });

const ProjectNetwork = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [hideLabels, setHideLabels] = useState(false);

    const [network, setNetwork] = useState();

    const [networkData, setNetworkData] = useState();
    const [graph, setGraph] = useState(null);
    const [currMode, setCurrMode] = useState('');
    const [currShortestPath, setCurrShortestPath] = useState([]);

    const [selectedMeasure, setSelectedMeasure] = useState();
    const [selectedGlobal, setSelectedGlobal] = useState();
    const [selectedLocal, setSelectedLocal] = useState();
    const [selectedIndividual, setSelectedIndividual] = useState();

    const [sourceNode, setSourceNode] = useState();
    const [targetNode, setTargetNode] = useState();

    const nodeRef = React.useRef(null);

    const [sliderValue, setSliderValue] = useState(0);
    const [maxEdges, setMaxEdges] = useState();

    const getMaxEdges = () => {
        const maxEdges = props.network.edges.map(({ weight }) => weight).reduce((a, b) => Math.max(a, b))
        setMaxEdges(maxEdges);
    }
    useEffect(() => {
        setNetworkData(props.network);
        getMaxEdges()
        graphBuilder(props.network, "init");
      }, []);

      const graphBuilder = (currNetwork, mode, path=null, hideLabels=null) => {
        let newGraph =  { id: uuidv4(), networkId: currNetwork.id, title: currNetwork.title, nodes: [], edges: [...currNetwork.edges]};
        // Reset edges color
        for (let j = 0; j < (newGraph.edges).length; j++) { 
            newGraph.edges[j].color = '#3335c0'     
        }
        
        // Filtered edges by weight
        const filteredEdges = newGraph.edges.filter((edge) => edge.weight >= sliderValue );
        newGraph.edges = filteredEdges;

        setCurrMode(mode)

        switch(mode) {
            case "init": {
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.label, shape: 'dot', value: 10, color: '#6366f1'} // default node
                    newGraph.nodes.push(graphNode);
                }
                setGraph(newGraph);
                break;
            }
            case "degree_centrality": {
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.centrality.degree, shape: 'dot', value: 10, color: '#6366f1'} // default node
                    graphNode.value = node.centrality.degree;
                    newGraph.nodes.push(graphNode);
                }
                setGraph(newGraph);
                break;
            }
            case "closeness_centrality": {
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.centrality.closeness, shape: 'dot', value: 10, color: '#6366f1'} // default node
                    graphNode.value = node.centrality.closeness;
                    newGraph.nodes.push(graphNode);
                }
                setGraph(newGraph);
                break;
            }
            case "betweenness_centrality": {
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.centrality.betweenness, shape: 'dot', value: 10, color: '#6366f1'} // default node
                    graphNode.value = node.centrality.betweenness;
                    newGraph.nodes.push(graphNode);
                }
                setGraph(newGraph);
                break;
            }
            case "center": {
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, label: hideLabels ? '' : node.label, shape: 'dot', value: 10, color: '#6366f1'} // default node
                    if(currNetwork.globalMeasures.center.includes(node.label)) {
                        graphNode.color = 'red';
                    }
                    newGraph.nodes.push(graphNode);
                }
                setGraph(newGraph);
                break;
            }
            case "search_shortest_path": { 
                // Colorize nodes
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.title, shape: 'dot', value: 10, color: '#6366f1'} // default node
                    if(path.includes(node.label)) {
                        graphNode.color = 'red'
                    }
                    newGraph.nodes.push(graphNode);
                }
                // Colorize edges
                for (let i = 0; i < path.length - 1; i++) {
                    for (let j = 0; j < (newGraph.edges).length; j++) {   
                        // console.log(`path[i]: ${path[i]} == from: ${newGraph.edges[j].from} && path[i+1]: ${path[i+1]} == to: ${newGraph.edges[j].to}`)
                        if( (path[i] == newGraph.edges[j].from) && (path[i+1] == newGraph.edges[j].to) ) {
                            newGraph.edges[j].color = 'red'
                            break;
                        }
                    }
                }
                setGraph(newGraph);  
                break;
            }
            case "community_detection": {
                for (const node of currNetwork.nodes) {
                    let graphNode = { id: node.label, group: node.group, label: hideLabels ? '' : node.label, shape: 'dot', value: 10} // default node
                    newGraph.nodes.push(graphNode);
                }
                setGraph(newGraph);
                break;
            }   
        }      
    }
    
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
            zoomView: false
        },
        physics: {
            enabled: true,
            hierarchicalRepulsion: {
                avoidOverlap: 0.8,
                springConstant: 0.001,
                nodeDistance: 100,
                damping: 1.5,
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
    };

    useEffect(() => {
        setSelectedGlobal();
        setSelectedLocal();
        setSelectedIndividual(); 
    }, [selectedMeasure]);

    useEffect(() => {
        if(networkData) {
            graphBuilder(networkData, currMode, currShortestPath, hideLabels)
        }
    }, [hideLabels]);

    useEffect(() => {
        if(networkData && selectedGlobal) {
            graphBuilder(networkData, selectedGlobal, null, hideLabels);
        }
    }, [selectedGlobal]);
    
    useEffect(() => {
        if(networkData && selectedLocal) {
            graphBuilder(networkData, selectedLocal, null, hideLabels);
        }
    }, [selectedLocal]);
    
    useEffect(() => {
        if(networkData && selectedIndividual) {
            graphBuilder(networkData, selectedIndividual, null, hideLabels);
        }
    }, [selectedIndividual]);


    const searchShortestPath = (e) => {
        e.preventDefault()
        let path = {};
        if (sourceNode && targetNode) {
            path = networkData.shortestPath[`${sourceNode.label}`][`${targetNode.label}`]; 
            setCurrShortestPath(path);      
            graphBuilder(networkData, 'search_shortest_path', path, hideLabels)
        }
    }

    const handleResetGraph = (e) => {
        e.preventDefault()
        if(networkData) {
            graphBuilder(networkData, 'init', null, hideLabels);
            setSelectedMeasure(); 
            setSelectedGlobal();
            setSelectedLocal();
            setSelectedIndividual(); 
        }
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

    const handleBlur = () => {
        if (sliderValue < 0) {
          setSliderValue(0);
        } else if (sliderValue > maxEdges) {
            setSliderValue(maxEdges);
        }
    };

    useEffect(() => {
        if(networkData) {
            graphBuilder(networkData, currMode, currShortestPath, hideLabels)
        }
    }, [sliderValue]);

  
    return (
        <Box sx={{position: 'relative'}}>
            <Stack direction={'column'} gap={1} position={'absolute'} zIndex={1} > 
                <IconButton onClick={zoomIn} color="default" size="large" sx={{ backgroundColor: 'white', color: '#6366f1'}}>
                    <AddIcon/>
                </IconButton>
                <IconButton onClick={zoomOut} color="default" size="large" sx={{ backgroundColor: 'white', color: '#6366f1'}}>
                    <RemoveIcon/>
                </IconButton>
            </Stack>
            
            <Draggable nodeRef={nodeRef} bounds="parent">
                <Box ref={nodeRef} sx={{ align: 'right', width: 320, backgroundColor: 'white', p: 1, position: 'absolute', zIndex: 1, right: 0}}> 
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={{ color: '#6366f1' }}>SNAP Analysis</Typography>
                        <IconButton onClick={() => setExpanded(!expanded)}>
                            { expanded ? <CloseFullscreenIcon/> : <OpenInFullIcon/> }
                        </IconButton>
                    </Stack>
                    
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Stack direction={'column'} gap={2.5} mt={2}>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <FormControlLabel sx={{ color: '#0000008A'}}
                                    label="Hide labels"
                                    control={<Checkbox color='default' sx={{ color: '#6366f1' }} checked={hideLabels} onChange={() => setHideLabels(event.target.checked)} />}
                                />
                                <IconButton onClick={handleResetGraph} title="Reset graph" sx={{ mr: 1, backgroundColor: "#6366f1", color: 'white', borderRadius: 1, height: 30, width: 30,  "&:hover": { backgroundColor: "#4e50c6" }}}><RestartAltIcon/></IconButton>
                            </Stack>
                            
                            <Box>
                                <ToggleButtonGroup sx={{ mb: 1, height: 50 }} color="primary" value={selectedMeasure} exclusive onChange={(e, value) => setSelectedMeasure(value)} >
                                    <ToggleButton className={classes.toggleBtn} value="individual measures"><Typography variant={"body2"}>Individual Measures</Typography></ToggleButton>
                                    <ToggleButton className={classes.toggleBtn} value="local measures"><Typography variant={"body2"}>Local Measures</Typography></ToggleButton>
                                    <ToggleButton className={classes.toggleBtn} value="global measures"><Typography variant={"body2"}>Global Measures</Typography></ToggleButton>
                                </ToggleButtonGroup>

                                { selectedMeasure === "individual measures" &&
                                    <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedIndividual} exclusive onChange={(e, value) => setSelectedIndividual(value)} >
                                        <ToggleButton className={classes.toggleBtn} value="degree_centrality">
                                            <Tooltip title="The degree centrality for a node is the fraction of nodes it is connected to." arrow>
                                                <Typography variant={"body2"}>Degree Centrality</Typography>
                                            </Tooltip>
                                        </ToggleButton>

                                        <ToggleButton className={classes.toggleBtn} value="closeness_centrality">
                                            <Tooltip title="Closeness centrality of a node is the reciprocal of the average shortest path distance to him over all n-1 reachable nodes." arrow>
                                                <Typography variant={"body2"}>Closeness Centrality</Typography>
                                            </Tooltip>
                                        </ToggleButton>

                                        <ToggleButton className={classes.toggleBtn} value="betweenness_centrality">
                                            <Tooltip title="Betweenness centrality of a node is the sum of the fraction of all-pairs shortest paths that pass through him." arrow>
                                                <Typography variant={"body2"}>Betweenness Centrality</Typography>
                                            </Tooltip>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                }

                                { selectedMeasure === "local measures" &&
                                    <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedLocal} exclusive onChange={(e, value) => setSelectedLocal(value)} >
                                        <ToggleButton className={classes.toggleBtn} value="community_detection"><Typography variant={"body2"}>Community Detection</Typography></ToggleButton>
                                    </ToggleButtonGroup>
                                }

                                { selectedMeasure === "global measures" &&
                                    <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedGlobal} exclusive onChange={(e, value) => setSelectedGlobal(value)} >
                                    
                                        <ToggleButton className={classes.toggleBtn} value="shortest path">
                                            <Tooltip title="Compute shortest paths in the graph." arrow>
                                                <Typography variant={"body2"}>Shortest Path</Typography>
                                            </Tooltip>
                                        </ToggleButton>

                                        <ToggleButton  className={classes.toggleBtn} value="center">
                                            <Tooltip title="The center is the set of nodes with eccentricity equal to radius." arrow>
                                                <Typography variant={"body2"}>Center</Typography>
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
                            </Box>
                            <Box>
                                <Stack direction={"row"} spacing={1.3} justifyContent={"flex-start"}>
                                    <MessageOutlinedIcon sx={{ color: '#6366f1', fontSize: 21 }} />
                                    <Typography id="input-slider" sx={{color: '#0000008A', fontSize: 15}}>
                                        Minimum Messages per Member
                                    </Typography>
                                    <Input className={classes.sliderInput} sx={{fontSize: 15}}
                                        value={sliderValue}
                                        size="small"
                                        onChange={(event) => setSliderValue(event.target.value === '' ? '' : Number(event.target.value))}
                                        onBlur={handleBlur}
                                        inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: maxEdges,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Stack>
                                <Slider sx={{ color: '#6366f1' }} onMouseDown={(e) => e.stopPropagation() }
                                    value={typeof sliderValue === 'number' ? sliderValue : 0}
                                    onChange={(event, newValue) => setSliderValue(newValue)}
                                    min={0} max={maxEdges}
                                    aria-labelledby="input-slider"
                                />
                            </Box>
                        </Stack>
                    </Collapse>
                </Box>
            </Draggable>

            <Box sx={{ width: '100%', height: '90vh'}}>
                { graph && <Graph key={graph.id} style={{width: '99%', height: '100%'}} graph={graph} options={options} events={events} getNetwork={network => { setNetwork(network); }}/> }
            </Box>
        </Box>
    )

}
export default ProjectNetwork;
