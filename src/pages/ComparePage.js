
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles';
import { v4 as uuidv4 } from "uuid";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { Layout } from '../components/Layout'
import VisGraph from '../components/VisGraph'
import Fab from '@mui/material/Fab';
import TableViewIcon from '@mui/icons-material/TableView';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LabelIcon from '@mui/icons-material/Label';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import CompareTable from '../components/CompareTable';

const useStyles = makeStyles({
  toggleBtn: {
      textTransform: 'none !important',
      '&.Mui-selected': {
          color: '#6366f1 !important',
      },
  },
});

const ComparePage = (props) => {
  const classes = useStyles();
  const [openTable, setOpenTable] = useState(false);

  const [selectedMeasure, setSelectedMeasure] = useState();
  const [selectedGlobal, setSelectedGlobal] = useState();
  const [selectedLocal, setSelectedLocal] = useState();
  const [selectedIndividual, setSelectedIndividual] = useState();

  const [networksData, setNetworksData] = useState([]);
  const [graphs, setGraphs] = useState([]);
  const [currMode, setCurrMode] = useState('');
  const [hideLabels, setHideLabels] = useState(false);

  useEffect(() => {
    const compareList = props.location?.state.compareList;
   
    setNetworksData(compareList);
    compareList.forEach( (item, index) => {
      graphBuilder(item, "init")
    });

  }, []);
  

  const graphBuilder = (currNetwork, mode, path=null, hideLabels=null) => {
    console.log("hideLabels", hideLabels)
    let newGraph =  { id: uuidv4(), networkId: currNetwork.id, title: currNetwork.title, nodes: [], edges: [...currNetwork.edges]};
    // Reset edges color
    for (let j = 0; j < (newGraph.edges).length; j++) {   
      newGraph.edges[j].color = '#3335c0'
    }
    
    setCurrMode(mode)

    switch(mode) {
      case "init": {
          for (const node of currNetwork.nodes) {
              let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.label, shape: 'dot', value: 10, color: '#6366f1'} // default node
              newGraph.nodes.push(graphNode);
          }
          if(graphs.length > 0) {
            setGraphs(prevState => prevState.map(
              data => data.networkId !== currNetwork.id ? data : newGraph))
          }
          else {
            setGraphs(prevState => [...prevState, newGraph])
          }
          break;
      }
      case "degree_centrality": {
          for (const node of currNetwork.nodes) {
              let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.centrality.degree, shape: 'dot', value: 10, color: '#6366f1'} // default node
              graphNode.value = node.centrality.degree;
              newGraph.nodes.push(graphNode);
          }
          if(graphs.length > 0) {
            setGraphs(prevState => prevState.map(
              data => data.networkId !== currNetwork.id ? data : newGraph))
          }
          else {
            setGraphs(prevState => [...prevState, newGraph])
          }
          break;
      }
      case "closeness_centrality": {
          for (const node of currNetwork.nodes) {
              let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.centrality.closeness, shape: 'dot', value: 10, color: '#6366f1'} // default node
              graphNode.value = node.centrality.closeness;
              newGraph.nodes.push(graphNode);
          }
          if(graphs.length > 0) {
            setGraphs(prevState => prevState.map(
              data => data.networkId !== currNetwork.id ? data : newGraph))
          }
          else {
            setGraphs(prevState => [...prevState, newGraph])
          }
          break;
      }
      case "betweenness_centrality": {
          for (const node of currNetwork.nodes) {
              let graphNode = { id: node.label, label: hideLabels ? '' : node.label, title: node.centrality.betweenness, shape: 'dot', value: 10, color: '#6366f1'} // default node
              graphNode.value = node.centrality.betweenness;
              newGraph.nodes.push(graphNode);
          }
          if(graphs.length > 0) {
            setGraphs(prevState => prevState.map(
              data => data.networkId !== currNetwork.id ? data : newGraph))
          }
          else {
            setGraphs(prevState => [...prevState, newGraph])
          }
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
        if(graphs.length > 0) {
          setGraphs(prevState => prevState.map(
            data => data.networkId !== currNetwork.id ? data : newGraph))
        }
        else {
          setGraphs(prevState => [...prevState, newGraph])
        }
        break;
      }
      case "community_detection": {
        for (const node of currNetwork.nodes) {
            let graphNode = { id: node.label, group: node.group, label: hideLabels ? '' : node.label, shape: 'dot', value: 10} // default node
            newGraph.nodes.push(graphNode);
        }
        if(graphs.length > 0) {
          setGraphs(prevState => prevState.map(
            data => data.networkId !== currNetwork.id ? data : newGraph))
        }
        else {
          setGraphs(prevState => [...prevState, newGraph])
        }
        break;
      }   
    }      
        
  }

  const handleResetGraph = (e) => {
    e.preventDefault()
    if(networksData) {
        networksData.forEach( (item, index) => {
          graphBuilder(item, "init", hideLabels)
        });
        setSelectedMeasure(); 
        setSelectedGlobal();
        setSelectedLocal();
        setSelectedIndividual(); 
    }
}

  useEffect(() => {
    setSelectedGlobal();
    setSelectedLocal();
    setSelectedIndividual(); 
  }, [selectedMeasure]);

  useEffect(() => {
    networksData.forEach( (item, index) => {
      graphBuilder(item, currMode, null, hideLabels)
    });
}, [hideLabels]);

  useEffect(() => {
    networksData.forEach( (item, index) => {
      graphBuilder(item, selectedGlobal, null, hideLabels)
    });
  }, [selectedGlobal]);

  useEffect(() => {
    networksData.forEach( (item, index) => {
      graphBuilder(item, selectedLocal, null, hideLabels)
    });

  }, [selectedLocal]);

  useEffect(() => {
    networksData.forEach( (item, index) => {
      graphBuilder(item, selectedIndividual, null, hideLabels)
    });

  }, [selectedIndividual]);



  const eachNetwork = (item, index) => {
    return  (
      <Box key={item.id} index={index} sx={{  display: 'flex',flexDirection: 'column', width: '35vw',  height: '50vh', backgroundColor: '#f5f5f5', border: '1px #dddddd solid'}} >
        <Typography sx={{ position: 'absolute', zIndex: 1, marginLeft: 1 }}>{ item.title }</Typography>
        <VisGraph graph={item}></VisGraph>
      </Box>
    )
  };

  return (
    <Layout>
      <Box>
        <Typography display="inline" component={Link} to={`/projects/${props.location?.state.project.id}`}
          sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1", textDecoration: 'none', "&:hover": { textDecoration: "underline" } }}>
          {props.location?.state.project.name}
        </Typography>
        <Typography display="inline" sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1", pr: 1, pl: 1 }}>/</Typography>
        <Typography display="inline" sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Compare Conversations</Typography>
        <Stack direction={"column"} gap={1.5} sx={{ position: 'fixed', right: 20, zIndex: 1}}>
          <Fab onClick={()=> setOpenTable(true)} size='medium' color="primary" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }  }}>
            <TableViewIcon />
          </Fab>
          <Fab onClick={()=> setHideLabels(!hideLabels)} size='medium' color="primary" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }  }}>
            {
              hideLabels ? <LabelOffIcon/> : <LabelIcon/>
            }
          </Fab>
          <Fab onClick={handleResetGraph} size='medium' color="primary" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }  }}>
            <RestartAltIcon />
          </Fab>
        </Stack>
        <Stack gap={1} sx={{ height: 130}}>
          <Box sx={{ mt: 2}} >
            <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedMeasure} exclusive onChange={(e, value) => setSelectedMeasure(value)} >
              <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="individual measures">Individual Measures</ToggleButton>
              <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="local measures">Local Measures</ToggleButton>
              <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="global measures">Global Measures</ToggleButton>
            </ToggleButtonGroup>
          </Box>

            { selectedMeasure === "individual measures" &&
              <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedIndividual} exclusive onChange={(e, value) => setSelectedIndividual(value)} >
                  <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="degree_centrality">Degree Centrality</ToggleButton>
                  <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="closeness_centrality">Closeness Centrality</ToggleButton>
                  <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="betweenness_centrality">Betweenness Centrality</ToggleButton>
              </ToggleButtonGroup>
            }

            { selectedMeasure === "local measures" &&
              <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedLocal} exclusive onChange={(e, value) => setSelectedLocal(value)} >
                  <ToggleButton className={classes.toggleBtn} sx={{ textTransform: 'none' }} value="community_detection">Community Detection</ToggleButton>
              </ToggleButtonGroup>
            }  

            { selectedMeasure === "global measures" &&
              <ToggleButtonGroup sx={{ height: 50 }} color="primary" value={selectedGlobal} exclusive onChange={(e, value) => setSelectedGlobal(value)} >
                <ToggleButton  className={classes.toggleBtn} value="center">
                  <Tooltip title="The center is the set of nodes with eccentricity equal to radius." arrow>
                      <Typography variant={"body2"}>Center</Typography>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            }
        </Stack>
      </Box>
      
      <Box sx={{  display: 'flex', flexDirection: 'row',  flexWrap: 'wrap', mt: 4, }}>
            { graphs && graphs.map(eachNetwork) }
      </Box>
      { openTable && <CompareTable compareList={props.location?.state.compareList}/>}
    </Layout>
  )
}
export default ComparePage;