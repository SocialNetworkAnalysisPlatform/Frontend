
import React, { useState, useEffect  } from 'react'
import { usePopupState, bindTrigger, bindMenu, } from 'material-ui-popup-state/hooks'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Checkbox from '@mui/material/Checkbox';
import Network from '../components/Network'

const ProjectPage = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const [networks, setNetworks] = useState([
            {id:1, title: "Social", description: 'first', source: "Linoy",
          createdBy: { id: 10101010, displayName: 'Sagi', photoURL: ''},
          createdAt: '2020-10-05T14:48:00.000Z', isPublished: false},

          {id:2, title: "Social2", description: 'second', source: "Linoy",
          createdBy: { id: 2, displayName: 'Linoy', photoURL: ''},
          createdAt: '2020-10-05T14:48:00.000Z', isPublished: false},

          {id:3, title: "Soc", description: 'second', source: "Linoy",
          createdBy: { id: 2, displayName: 'Linoy', photoURL: ''},
          createdAt: '2020-10-05T14:48:00.000Z', isPublished: false},

          {id:4, title: "sada", description: 'first', source: "Linoy",
          createdBy: { id: 10101010, displayName: 'Sagi', photoURL: ''},
          createdAt: '2020-10-05T14:48:00.000Z', isPublished: false},
    ]);
    const [filteredNetworks, setFilteredNetworks] = useState(networks);

    const project =  {
        id: 1, owner: { id: 10101010, displayName: "Sagi"}, shared: false, name: 'Doctors Among The World', conversations: [{ id: 1, name: "USA", source: {} }], description: "Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi", createdAt: "2020-10-05T14:48:00.000Z",
        collaborators: [{ id: 10101010, displayName: 'Sagi', photoURL: ''}, { id: 2, displayName: 'Linoy', photoURL: ''} ],
        networks: networks
    }
      

    const [searchInput, setSearchInput] = useState('');

    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

    // Create dynamic key & value: collaborator id : false
    let collaborators = {}
    project.collaborators.map((collaborator) => {
        collaborators[`${collaborator.id}`] = true
    })
    // checked list - created by collaborator filter
    const [clCreatedBy, setClCreatedBy] = useState(collaborators);
      
    useEffect(() => {
        // When CreatedBy checkbox changed
        handleSearchAndFilter(searchInput);
    }, [clCreatedBy]);


    const handleSearchAndFilter = (text) => {
        const isFilteredByCreatedBy = () => {
            for (let [key, value] of Object.entries(clCreatedBy)) {
                if(value == false) {
                    return true;
                }
            }
            return false;
          }
        
        const isFilteredCreatedBy = isFilteredByCreatedBy();

        let result = null;
        if (!text && !isFilteredCreatedBy) { // Regular
            result = networks;
        } else if (text && !isFilteredCreatedBy) { // Filtered by text ONLY
            result = networks.filter((row) => {
                return row.title.toLowerCase().includes(text.toLowerCase());
            });
        } else if (!text && isFilteredCreatedBy) { // Filtered by checkbox ONLY
            result = []
            for (let [key, value] of Object.entries(clCreatedBy)) {
                const filterRes = networks.filter((row) => {
                    return (value == true && (Number(key) == Number(row.createdBy.id)))
                });
                result.push(...filterRes)
            }
        } else if (text && isFilteredCreatedBy) { // Filtered by Both
            result = []
            for (let [key, value] of Object.entries(clCreatedBy)) {
                const filterRes = filteredNetworks.filter((row) => {
                    return (value == true && (Number(key) == Number(row.createdBy.id)))
                });
                result.push(...filterRes)
            }
            result = result.filter((row) => {
                return row.title.toLowerCase().includes(text.toLowerCase());
            });
        }
        setFilteredNetworks(result); 
    }

    

      const eachNetwork = (item, index) => {
        return  (<Network key={item.id} index={index} network={item}></Network>)
    };
   

    return (
        <Layout>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <OutlinedInput sx={{ width: 500, height: 32 }} placeholder='Find a network...' value={searchInput} onChange={(e) => { setSearchInput(e.target.value); handleSearchAndFilter(e.target.value); } }/> 
                <Button endIcon={<KeyboardArrowDownIcon/>} {...bindTrigger(popupState)} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none",}} >
                    Created by 
                </Button>
                <Menu sx={{ ml: -3, }} {...bindMenu(popupState)}>
                    {
                        project.collaborators.map((collaborator) => {
                            return (
                                <MenuItem sx={{ pr: 7 }} >
                                    <Checkbox color="primary" checked={clCreatedBy[`${collaborator.id}`]} onChange={() => {setClCreatedBy({...clCreatedBy, [`${collaborator.id}`]: event.target.checked}); } }/>
                                    <Avatar sx={{ width: 25, height: 25, mr: 2}} src={collaborator.photoURL}/>
                                    <Typography sx={{ wordWrap: 'break-word' }}>{collaborator.displayName}</Typography>     
                                </MenuItem>
                            )
                    })}
                </Menu>
           
           
            </Stack>
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={'left'} style={{ minWidth: 70 }}></TableCell>
                            <TableCell align={'left'} style={{ minWidth: 130 }}>Title</TableCell>
                            <TableCell align={'left'} style={{ minWidth: 130 }}>Description</TableCell>
                            <TableCell align={'left'} style={{ minWidth: 130 }}>Source</TableCell>
                            <TableCell align={'left'} style={{ minWidth: 130 }}>Created date</TableCell>
                            <TableCell align={'left'} style={{ minWidth: 130 }}>Created by</TableCell>
                            <TableCell align={'center'} style={{ minWidth: 70 }}></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredNetworks
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(eachNetwork)
                        }
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={networks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Layout>
    )
}
export default ProjectPage;