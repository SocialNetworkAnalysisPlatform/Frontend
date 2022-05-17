
import React, { useState, useEffect } from 'react'
import jsPDF from 'jspdf';  
import html2canvas from 'html2canvas';  
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as math from 'mathjs';
import { CSVLink } from "react-csv";

import ReactHighCharts from "react-highcharts";

import bellcurve from "highcharts/modules/histogram-bellcurve";
bellcurve(ReactHighCharts.Highcharts);


const useStyles = makeStyles({
    card: {
        width: '23%',
        boxShadow: '0 0 8px 3px #dde7ec !important',
    },
    cardGroup: {
        boxShadow: '0 0 8px 3px #dde7ec !important',
    },
    subCard: {
        width: '23%',
        backgroundColor: '#f0f3f7 !important',
        boxShadow: 'none !important'
    },
  });



const DescriptiveStatistics = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const [csvData, setCsvData] = useState([]);
    const csvHeaders = [
        { label: "Conversation Title", key: "conversationTitle" },
        { label: "Nodes", key: "nodes" },
        { label: "Edges", key: "edges" },
        { label: "Diameter", key: "diameter" },
        { label: "Radius", key: "radius" },
        { label: "Density", key: "density" },
        { label: "Self-loops", key: "selfLoops" },
        { label: "Avg. Clustering", key: "avgClustering" },
        { label: "Transitivity", key: "transitivity" },
        { label: "Reciprocity", key: "reciprocity" },
        { label: "Avg. Degree Centrality", key: "avgDegreeCentrality" },
        { label: "Avg. Closeness Centrality", key: "avgClosenessCentrality" },
        { label: "Avg. Betweenness Centrality", key: "avgBetweennessCentrality" },
    ];

    useEffect(() => {
        const network = props.network;
        let data = [{
                conversationTitle: network.title, nodes: network.nodes.length, edges: network.edges.length, diameter: network.globalMeasures.diameter.value,
                radius: network.globalMeasures.radius.value, density: fixNum(props.network?.globalMeasures.density), selfLoops: network.globalMeasures.numberOfSelfLoops,
                avgClustering: fixNum(props.network?.localMeasures.average_clustering), transitivity: fixNum(props.network?.localMeasures.transitivity), 
                reciprocity: fixNum(props.network?.localMeasures.reciprocity), avgDegreeCentrality: calcAvgCentrality("degree"),
                avgClosenessCentrality: calcAvgCentrality("closeness"), avgBetweennessCentrality: calcAvgCentrality("betweenness")
            }
        ];
        setCsvData(data);
    }, []);

    const fixNum = (num) => {
        return `${parseFloat((num)?.toFixed(3))}`;
    }

    const getCentralityValues = (centralityType) => {
        const nodes = props.network.nodes;
        let values = [];
        nodes.forEach((node) =>{
            values.push(node.centrality[`${centralityType}`]); 
        });
        return values;
    }

    const BellCurveConfigDegree = {
        title: {
            text: "Bell Curve"
        },
        xAxis: [
            {
                title: {
                    text: "Data"
                },
                alignTicks: false
            },
            {
                title: {
                    text: "Bell Curve"
                },
                alignTicks: false,
                opposite: true
            }
        ],
        yAxis: [
            {
                title: { text: "Data" }
            },
            {
                title: { text: "Bell Curve" },
                opposite: true
            }
        ],
        series: [
            {
              name: "Bell curve",
              type: "bellcurve",
              xAxis: 1,
              yAxis: 1,
              baseSeries: 1,
              zIndex: -1
            },
            {
              name: "Data",
              type: "scatter",
              data: getCentralityValues("degree"),
              accessibility: {
                exposeAsGroupOnly: true
              },
              marker: {
                radius: 1.5
              }
            }
        ]
    };

    const BellCurveConfigCloseness = {
        title: {
            text: "Bell Curve"
        },
        xAxis: [
            {
                title: {
                    text: "Data"
                },
                alignTicks: false
            },
            {
                title: {
                    text: "Bell Curve"
                },
                alignTicks: false,
                opposite: true
            }
        ],
        yAxis: [
            {
                title: { text: "Data" }
            },
            {
                title: { text: "Bell Curve" },
                opposite: true
            }
        ],
        series: [
            {
              name: "Bell curve",
              type: "bellcurve",
              xAxis: 1,
              yAxis: 1,
              baseSeries: 1,
              zIndex: -1
            },
            {
              name: "Data",
              type: "scatter",
              data: getCentralityValues("closeness"),
              accessibility: {
                exposeAsGroupOnly: true
              },
              marker: {
                radius: 1.5
              }
            }
        ]
    };
   
    const BellCurveConfigBetweenness  = {
        title: {
            text: "Bell Curve"
        },
        xAxis: [
            {
                title: {
                    text: "Data"
                },
                alignTicks: false
            },
            {
                title: {
                    text: "Bell Curve"
                },
                alignTicks: false,
                opposite: true
            }
        ],
        yAxis: [
            {
                title: { text: "Data" }
            },
            {
                title: { text: "Bell Curve" },
                opposite: true
            }
        ],
        series: [
            {
              name: "Bell curve",
              type: "bellcurve",
              xAxis: 1,
              yAxis: 1,
              baseSeries: 1,
              zIndex: -1
            },
            {
              name: "Data",
              type: "scatter",
              data: getCentralityValues("betweenness"),
              accessibility: {
                exposeAsGroupOnly: true
              },
              marker: {
                radius: 1.5
              }
            }
        ]
    };

    
    const calcStandardDeviation  = (mode) => {
        const nodes = props.network.nodes;
        let arr = [];
        nodes.forEach((node) =>{
            arr.push(node.centrality[`${mode}`]); 
        });
        let standardDeviation = math.std(arr)
        return fixNum(standardDeviation)
    }

    const calcAvgCentrality = (mode) => {
        const nodes = props.network.nodes;
        let sum = 0;
        nodes.forEach((node) =>{
            sum += node.centrality[`${mode}`]; 
        });
        let avg = sum / nodes.length;        
        return fixNum(avg)
    }


    const calcMax = (mode) => {
        const nodes = props.network.nodes;   
        let max = -Infinity, label = '';
        for(let i in nodes) {
            if( nodes[i].centrality[`${mode}`] > max) {
                max = nodes[i].centrality[`${mode}`];
            } 
        }
        return fixNum(max)
    }

    const calcMin = (mode) => {
        const nodes = props.network.nodes;   
        let min = Infinity, label = '';
        for(let i in nodes) {
            if( nodes[i].centrality[`${mode}`] < min) {
                min = nodes[i].centrality[`${mode}`];
            } 
        }
        return fixNum(min)
    }


    console.log("network", props.network)

    const printDocument = async () => {
        const printSection = async (elementId, doc, isFirstPage = false) => {
            const dom = document.getElementById(elementId);
            const canvas = await html2canvas(dom);
    
            const imgWidth = 200;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            const imgData = canvas.toDataURL("image/png");
    
            if(isFirstPage) {
                if(props.type === "conversation") {
                    doc.text(`${props.conversationTitle[0]} / ${props.conversationTitle[1]}`, 5, 10);
                }
                else if (props.type === "explore conversation") {
                    doc.text(props.conversationTitle, 5, 10);
                }
            }
    
            doc.addImage(imgData, "JPEG", 5, 15, imgWidth, imgHeight);
    
            if(isFirstPage) {
                doc.addPage();
            }
        };
        
        const doc = new jsPDF("p", "mm", "a4");
        await printSection("first", doc, true);
        await printSection("second", doc);
    
        if(props.type === "conversation") {
            doc.save(`${props.conversationTitle[0]} - ${props.conversationTitle[1]}.pdf`);
        }
        else if (props.type === "explore conversation") {
            doc.save(props.conversationTitle);
        }
      };
   
    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<SummarizeOutlinedIcon/>} onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 100, textTransform: "none", }}>
                Report
            </Button>
            <Popover sx={{position: 'absolute !important',}}
                open={open}
                disableScrollLock={'true'}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
            >
                <List>
                    <ListItem button sx={{ "&:hover": { backgroundColor: '#ededff'} }}>
                    <CSVLink data={csvData} headers={csvHeaders} filename={`${props.network.title}.csv`} style={{ textDecoration: 'none' }}>
                        <Typography sx={{fontFamily: 'Roboto', fontSize: 14, textDecorationLine: 'none', color: '#000000DE'}}>Export as CSV</Typography>
                    </CSVLink>
            
                    </ListItem>
                    <ListItem button onClick={printDocument} sx={{ "&:hover": { backgroundColor: '#ededff'}} }>
                        <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontSize: 14}}>Export as PDF</Typography>} />
                    </ListItem>
                </List>                 
            </Popover>
        </Box>
        
        <Stack id="pdfdiv" direction={'column'}>
            <Box id="first" sx={{ backgroundColor: '#f0f3f7' }}>
                <Box>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#4f5676', mb: '2.7%', fontWeight: 700}}>Global Measures</Typography>
                    <Stack direction={'row'} justifyContent={'center'} spacing={'2.7%'}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Nodes
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {props.network?.nodes.length}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Edges
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {props.network?.edges.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>

                    <Stack direction={'row'} justifyContent={'space-between'} mt={'2.7%'} >
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Diameter
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {props.network?.globalMeasures.diameter.value}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Radius
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {props.network?.globalMeasures.radius.value}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Density
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {fixNum(props.network?.globalMeasures.density)}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Self-loops
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {props.network?.globalMeasures.numberOfSelfLoops}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>

                <Box sx={{ mt: '2.7%' }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#4f5676', mb: '2.7%', fontWeight: 700}}>Local Measures</Typography>
                    <Stack direction={'row'} justifyContent={'center'} spacing={'2.7%'}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Avg. Clustering
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {fixNum(props.network?.localMeasures.average_clustering)}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Transitivity
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {fixNum(props.network?.localMeasures.transitivity)}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Reciprocity
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {fixNum(props.network?.localMeasures.reciprocity)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>

                <Box sx={{ mt: '2.7%'}}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#4f5676', mb: '2.7%', fontWeight: 700}}>Individual Measures</Typography>
                    <Card className={classes.cardGroup}>
                        <CardContent>
                            <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                Degree Centrality
                            </Typography>
                            <Stack direction={'row'} justifyContent={'center'} spacing={'2.7%'}>
                                <Card className={classes.subCard}>
                                    <CardContent>
                                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                            Avg.
                                        </Typography>
                                        <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                            {calcAvgCentrality("degree")}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <Card className={classes.subCard}>
                                    <CardContent>
                                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                            Standard Deviation
                                        </Typography>
                                        <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                            {calcStandardDeviation("degree")}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <Card className={classes.subCard}>
                                    <CardContent>
                                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                            Min.
                                        </Typography>
                                        <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                            {calcMin("degree")}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <Card className={classes.subCard}>
                                    <CardContent>
                                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                            Max.
                                        </Typography>
                                        <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                            {calcMax("degree")}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </CardContent>
                        <ReactHighCharts config={BellCurveConfigDegree} />
                    </Card>
                </Box>

                <Card className={classes.cardGroup} sx={{ mt: '2.7%'}}>
                    <CardContent>
                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                            Closeness Centrality
                        </Typography>
                        <Stack direction={'row'} justifyContent={'center'} spacing={'2.7%'} mt={'2.7%'} >
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Avg.
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcAvgCentrality("closeness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Standard Deviation
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcStandardDeviation("closeness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Min.
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcMin("closeness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Max.
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcMax("closeness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </CardContent>
                    <ReactHighCharts config={BellCurveConfigCloseness}/>
                </Card>

                <Card className={classes.cardGroup} sx={{ mt: '2.7%'}}>
                    <CardContent>
                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                            Betweenness Centrality
                        </Typography>
                        <Stack direction={'row'} justifyContent={'center'} spacing={'2.7%'} mt={'2.7%'} >
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Avg.
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcAvgCentrality("betweenness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Standard Deviation
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcStandardDeviation("betweenness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Min.
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcMin("betweenness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.subCard}>
                                <CardContent>
                                    <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                        Max.
                                    </Typography>
                                    <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                        {calcMax("betweenness")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </CardContent>
                    <ReactHighCharts config={BellCurveConfigBetweenness}/>
                </Card>
            </Box>
            <Box  id="second" sx={{ backgroundColor: '#f0f3f7' }}>
                <Card className={classes.cardGroup} sx={{ mt: '2.7%' }}>
                    <CardContent>
                        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                            Top Activity
                        </Typography>
                        <Box sx={{  display:'flex', justifyContent:'center', }}>
                            {
                                props.network.statistics.topActivity &&
                                <BarChart width={600} height={400} layout="vertical"
                                data={props.network.statistics.topActivity} barCategoryGap="1%">
                                <CartesianGrid strokeDasharray="3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="node" width={150} interval={0} textAnchor= "end" />
                                <Tooltip />
                                <Bar dataKey="messages" fill='#6366f1'/>
                            </BarChart>
                            }
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        
        </Stack>
        </>

    )

}
export default DescriptiveStatistics;