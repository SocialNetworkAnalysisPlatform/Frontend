
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import NewWindow from 'react-new-window'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles({
  
  });

const CompareTable = (props) => {
    const classes = useStyles();
    const [avgData, setAvgData] = useState()
    const networks = props.compareList;

    const fixNum = (num) => {
        return `${parseFloat((num)?.toFixed(3))}`;
    }

    useEffect(() => {
        const avgNodes = (networks.map(({ nodes }) => nodes.length).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgEdges = (networks.map(({ edges }) => edges.length).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgDiameter = (networks.map(({ globalMeasures }) => globalMeasures.diameter.value).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgRadius = (networks.map(({ globalMeasures }) => globalMeasures.radius.value).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgDensity = (networks.map(({ globalMeasures }) => globalMeasures.density).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgSelfLoops = (networks.map(({ globalMeasures }) => globalMeasures.numberOfSelfLoops).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgOfAvgClustering = (networks.map(({ localMeasures }) => localMeasures.average_clustering).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgTransitivity = (networks.map(({ localMeasures }) => localMeasures.transitivity).reduce((sum, i) => sum + i, 0)) / networks.length;
        const avgReciprocity = (networks.map(({ localMeasures }) => localMeasures.reciprocity).reduce((sum, i) => sum + i, 0)) / networks.length;
        setAvgData({ avgNodes: avgNodes, avgEdges: avgEdges, avgDiameter: avgDiameter,
            avgRadius: avgRadius, avgDensity: avgDensity, avgSelfLoops: avgSelfLoops,
            avgOfAvgClustering: avgOfAvgClustering, avgTransitivity: avgTransitivity, avgReciprocity: avgReciprocity
        }); 
}, []);


    const checkCellColor = (num, avg) => {
        return num > avg ? 'green' : (num !== avg) ? 'red' : ''
    }
  

    return (
        <NewWindow features={{ width: window.innerWidth, height: window.innerHeight,}} title="Networks Comparison Table">
            <TableContainer component={Paper}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                        <TableCell align="center" colSpan={5}>
                            Global Measures
                        </TableCell>
                        <TableCell align="center" colSpan={5}>
                            Local Measures
                        </TableCell>
                        <TableCell align="center" colSpan={10}>
                            Individual Measures
                        </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Conversation Title</TableCell>
                            <TableCell align="left">Nodes</TableCell>
                            <TableCell align="left">Edges</TableCell>
                            <TableCell align="left">Diameter</TableCell>
                            <TableCell align="left">Radius</TableCell>
                            <TableCell align="left">Density</TableCell>
                            <TableCell align="left">Self-loops</TableCell>
                            <TableCell align="left">Avg. Clustering</TableCell>
                            <TableCell align="left">Transitivity</TableCell>
                            <TableCell align="left">Reciprocity</TableCell>
                            <TableCell align="left">Degree Centrality</TableCell>
                            <TableCell align="left">Closeness Centrality</TableCell>
                            <TableCell align="left">Betweenness Centrality</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.compareList.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ width: 150 }}>{row.title}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(row.nodes.length, avgData?.avgNodes) }} >{row.nodes.length}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(row.edges.length, avgData?.avgEdges) }} >{row.edges.length}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(row.globalMeasures.diameter.value, avgData?.avgDiameter) }} >{row.globalMeasures.diameter.value}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(row.globalMeasures.radius.value, avgData?.avgRadius) }} >{row.globalMeasures.radius.value}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(fixNum(row.globalMeasures.density), avgData?.avgDensity) }} >{fixNum(row.globalMeasures.density)}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(row.globalMeasures.numberOfSelfLoops, avgData?.avgSelfLoops) }} >{row.globalMeasures.numberOfSelfLoops}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(fixNum(row.localMeasures.average_clustering), avgData?.avgOfAvgClustering) }} >{fixNum(row.localMeasures.average_clustering)}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(fixNum(row.localMeasures.transitivity), avgData?.avgTransitivity) }} >{fixNum(row.localMeasures.transitivity)}</TableCell>
                                <TableCell align="left" sx={{ color: checkCellColor(fixNum(row.localMeasures.reciprocity), avgData?.avgReciprocity) }} >{fixNum(row.localMeasures.reciprocity)}</TableCell>
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{ }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter sx={{ pt: 10}}>
                        <TableRow>
                            <TableCell sx={{ width: 150 , }}>Avg.</TableCell>
                            <TableCell align="left">{avgData?.avgNodes}</TableCell>
                            <TableCell align="left">{avgData?.avgEdges}</TableCell>
                            <TableCell align="left">{avgData?.avgDiameter}</TableCell>
                            <TableCell align="left">{avgData?.avgRadius}</TableCell>
                            <TableCell align="left">{fixNum(avgData?.avgDensity)}</TableCell>
                            <TableCell align="left">{avgData?.avgSelfLoops}</TableCell>
                            <TableCell align="left">{fixNum(avgData?.avgOfAvgClustering)}</TableCell>
                            <TableCell align="left">{fixNum(avgData?.avgTransitivity)}</TableCell>
                            <TableCell align="left">{fixNum(avgData?.avgReciprocity)}</TableCell>
                            <TableCell align="left">{ }</TableCell>
                            <TableCell align="left">{ }</TableCell>
                            <TableCell align="left">{ }</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </NewWindow>

    )
}
export default CompareTable;
