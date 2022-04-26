
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
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { LteMobiledata } from '@mui/icons-material';

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


    const calcAvgCentrality = (mode) => {
        const nodes = props.network.nodes;
        let sum = 0;
        nodes.forEach((node) =>{
            sum += node.centrality[`${mode}`]; 
        });
        let avg = sum / nodes.length;        
        return parseFloat(avg.toFixed(3))
    }

    const calcMax = (mode) => {
        const nodes = props.network.nodes;   
        let max = -Infinity, label = '';
        for(let i in nodes) {
            if( nodes[i].centrality[`${mode}`] > max) {
                max = nodes[i].centrality[`${mode}`];
            } 
        }
        return parseFloat(max.toFixed(3))
    }

    const calcMin = (mode) => {
        const nodes = props.network.nodes;   
        let min = Infinity, label = '';
        for(let i in nodes) {
            if( nodes[i].centrality[`${mode}`] < min) {
                min = nodes[i].centrality[`${mode}`];
            } 
        }
        return parseFloat(min.toFixed(3))
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
                doc.text(`${props.conversationTitle[0]} / ${props.conversationTitle[1]}`, 5, 10);
            }
    
            doc.addImage(imgData, "JPEG", 5, 15, imgWidth, imgHeight);
    
            if(isFirstPage) {
                doc.addPage();
            }
        };
        
        const doc = new jsPDF("p", "mm", "a4");
        await printSection("first", doc, true);
        await printSection("second", doc);
    
        doc.save(`${props.conversationTitle[0]} - ${props.conversationTitle[1]}.pdf`);
      };
   
    return (
        <>
        <Button onClick={printDocument}  variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 80, textTransform: "none", }} > Import </Button>
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
                                    {parseFloat((props.network?.globalMeasures.density).toFixed(3))}
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
                                    {parseFloat((props.network?.localMeasures.average_clustering).toFixed(3))}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Transitivity
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {parseFloat((props.network?.localMeasures.transitivity).toFixed(3))}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                                    Reciprocity
                                </Typography>
                                <Typography variant="h4" sx={{ textAlign: 'center'}}>
                                    {parseFloat((props.network?.localMeasures.reciprocity).toFixed(3))}
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