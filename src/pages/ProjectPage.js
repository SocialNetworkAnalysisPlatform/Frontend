import React, { useState, useEffect } from "react";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import OutputRoundedIcon from '@mui/icons-material/OutputRounded';
import IconButton from "@mui/material/IconButton";
import Conversation from "../components/Conversation";
import Skeleton from '@mui/material/Skeleton';
import SkeletonTableRow from "../skeletons/SkeletonTableRow"
import { useParams } from "react-router-dom";

import { rtdb, db } from "../utils/firebase";
import { ref, remove } from "firebase/database";
import { doc, onSnapshot, getDoc, setDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import Service from '../utils/service'
import { CSVLink } from "react-csv";

const service = Service.getInstance();

const ProjectPage = (props) => {
  const { currentUser } = useAuth();
  const params = useParams();
  const [disabledDelete, setDisabledDelete] = useState(true);
  const [disabledCompare, setDisabledCompare] = useState(true);
  const [disabledExport, setDisabledExport] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [project, setProject] = useState();

  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversations, setSelectedConversations] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  // checked list - created by collaborator filter
  const [clCreatedBy, setClCreatedBy] = useState({});

  // checked list - created by collaborator filter
  const [clConversations, setClConversations] = useState({});

  const [loading, setLoading] = useState(true);

  const MAX_NETWORKS_FOR_COMPARE = 4;

  const [checkedAll, setCheckedAll] = useState(false);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  const handleSearchAndFilter = (text) => {
    
    const isFilteredByCreatedBy = () => {
      for (let [key, value] of Object.entries(clCreatedBy)) {
        if (value == false) {
          return true;
        }
      }
      return false;
    };

    const isFilteredCreatedBy = isFilteredByCreatedBy();

    let result = null;
    if (!text && !isFilteredCreatedBy) {
      // Regular
      result = conversations;
    } else if (text && !isFilteredCreatedBy) {
      // Filtered by text ONLY
      result = conversations.filter((row) => {
        return row.title.toLowerCase().includes(text.toLowerCase());
      });
    } else if (!text && isFilteredCreatedBy) {
      // Filtered by checkbox ONLY
      result = [];
      for (let [key, value] of Object.entries(clCreatedBy)) {
        const filterRes = conversations.filter((row) => {
          return value == true && key == row.creator.id;
        });
        result.push(...filterRes);
      }

    } else if (text && isFilteredCreatedBy) {
      // Filtered by Both
      result = [];
      for (let [key, value] of Object.entries(clCreatedBy)) {
        const filterRes = filteredConversations?.filter((row) => {
          return value == true && key == row.creator.id;
        });
        result.push(...filterRes);
      }
      result = result?.filter((row) => {
        return row.title.toLowerCase().includes(text.toLowerCase());
      });
    }
    setFilteredConversations(result);
  };

  const handleCheckedConversation = (conversation, checkValue) => {
    for (let [key, value] of Object.entries(clConversations)) {
      if (key == conversation.id) {
        setClConversations({ ...clConversations, [`${conversation.id}`]: checkValue });
      }
    }
    
    // Handle creation of selected conversations list
    let conversationsList = selectedConversations;
    if (checkValue == true) {
      conversationsList.push(conversation);
      setSelectedConversations(conversationsList);
    } else {
        const res = conversationsList.filter(({id}) => id !== conversation.id);
        setSelectedConversations(res);
    }
  };

    useEffect(() => {
      let copyClConversations = {...clConversations}
      for (let [key, value] of Object.entries(clConversations)) {
        copyClConversations[`${key}`] = checkedAll
      }
      setClConversations(copyClConversations)

      if(checkedAll) {
        setSelectedConversations(filteredConversations);
      } else {
        setSelectedConversations([]);
      }
    }, [checkedAll])

    useEffect(() => {
      // When checkbox of one of clConversations list changed
      let networksCnt = 0;
      for (let [key, value] of Object.entries(clConversations)) {
        value ? ++networksCnt : "";
      }
      networksCnt === 0 ? setCheckedAll(false) : ''
      networksCnt > 0 ? ( setDisabledDelete(false), setDisabledExport(false) ) : ( setDisabledDelete(true), setDisabledExport(true) );
      networksCnt > 1 && networksCnt <= MAX_NETWORKS_FOR_COMPARE
        ? setDisabledCompare(false)
        : setDisabledCompare(true);
    }, [clConversations]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  useEffect(() => {
    const projectId = params.id;

    // Get project by id
    const unsub = onSnapshot(doc(db, "Projects", projectId), async(doc) => {
      const docData = doc.data();
      if (docData) {
        const { owner, collaborators, createdAt, conversations, ...data } = docData;
        
        // Check if user have access to project
        if (
          owner == currentUser.uid ||
          collaborators.includes(currentUser.uid)
        ) {
          const ownerData = await service.readUserData(owner);

            if(collaborators) {
              const collaboratorsData = await Promise.all(
                collaborators?.map(async(collaborator) => {
                    const data = await service.readUserData(collaborator);
                    return {
                        id: collaborator,
                        ...data
                    };
                })
            );
            collaboratorsData.push( { id: owner, ...ownerData });
            const project = {
              id: doc.id,
              owner: { id: owner, displayName: ownerData.displayName, photoUrl: ownerData.photoUrl },
              collaborators: collaboratorsData,
              ...data,
              createdAt: createdAt.toDate(),
              sources: data.sources?.map(conversation => conversation.path)
            }
            setProject(project);

            // Create dynamic key & value: collaborator id : false
            const clCollaborators = {};
            collaboratorsData.map((collaborator) => {
              clCollaborators[`${collaborator.id}`] = true;
            });
            setClCreatedBy(clCollaborators);
            }
         

            const conversationsData = [];
            // for loop conversations and get doc data
            if(conversations?.length > 0) {
            const conversationsRef = await Promise.all(
                conversations.map(async(conversationRef) => {

                  const docSnap = await getDoc(conversationRef);
                  if (docSnap.exists()) {
                    const docData = docSnap.data();
                    const { creator, createdAt, ...data } = docData;
                    const creatorData = await service.readUserData(creator);
                  
                    const shortestPath = await service.getNetworkShortestPath(docSnap.ref.path);
                    
                    conversationsData.push({ 
                      id: docSnap.id,
                      creator: { id: creator, displayName: creatorData.displayName, photoUrl: creatorData.photoUrl },
                      createdAt: createdAt.toDate(),
                      shortestPath,
                      ...data,
                    });
                  } 
                }
            ));

            setConversations(conversationsData);
            setFilteredConversations(conversationsData);

            // Create dynamic key & value: network id : false
            const clNetworks = {};
            conversationsData.map((network) => {
              clNetworks[`${network.id}`] = false;
            });
            setClConversations(clNetworks);
          }
          setLoading(false);

          }

      }
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // When checkbox of one of clCreatedBy list changed
    handleSearchAndFilter(searchInput);
  }, [clCreatedBy]);


  const deleteConversations = async() => {
    try {
      const projectId = params.id;

      await setDoc(doc(db, "Projects", projectId), {
        conversations: arrayRemove(...selectedConversations.map((conversation) => doc(db, "Conversations", conversation.id))),
        sources: arrayRemove(...selectedConversations.map((conversation) => doc(db, "Sources", conversation.id))),
      }, {
        merge: true
      });

      await Promise.all(
        selectedConversations.map(async(conversation) => {
          await remove(ref(rtdb, 'Conversations/' + conversation.id));
        }));

      await Promise.all(
        selectedConversations.map(async(conversation) => {
          return deleteDoc(doc(db, "Conversations", conversation.id));
        })
      );

      //Remove rows from table
      setConversations(prevState => (
        prevState.filter((conversation, i) => !selectedConversations.includes(conversation))
      ))
      setFilteredConversations(prevState => (
        prevState.filter((conversation, i) => !selectedConversations.includes(conversation))
      ))
    } catch(error) {
      console.log(error);
    } 

  }

  const handleVisibility = (networkId, isPublished) => {
    setFilteredConversations(prevState => prevState.map(
        data => data.id !== networkId ? data :
        {...data, isPublished: isPublished}
    ))
  }

  const calcAvgCentrality = (network, mode) => {
    const nodes = network.nodes;
    let sum = 0;
    nodes.forEach((node) =>{
        sum += node.centrality[`${mode}`]; 
    });
    let avg = sum / nodes.length;        
    return avg
}

  const exportNetworksToCSV = () => {
    let networksData = [];
    selectedConversations.forEach((network) => {
      const row = {
                conversationTitle: network.title, nodes: network.nodes.length, edges: network.edges.length, diameter: network.globalMeasures.diameter.value,
                radius: network.globalMeasures.radius.value, density: network.globalMeasures.density, selfLoops: network.globalMeasures.numberOfSelfLoops,
                avgClustering: network.localMeasures.average_clustering, transitivity: network.localMeasures.transitivity, 
                reciprocity: network.localMeasures.reciprocity, avgDegreeCentrality: calcAvgCentrality(network, "degree"),
                avgClosenessCentrality: calcAvgCentrality(network, "closeness"), avgBetweennessCentrality: calcAvgCentrality(network, "betweenness")
      };
      networksData.push(row)
    })
    setCsvData(networksData);
  }

  const handleUpdateConversation = (updatedConversation) => {
    setConversations(prevState => prevState.map(
      data => data.id !== updatedConversation.id ? data : updatedConversation))
  }

  const eachConversation = (item, index) => {
    return  (<Conversation key={item.id} index={index} project={project} conversation={item}
            checkedConversation={handleCheckedConversation} updatedConversation={handleUpdateConversation} visibility={handleVisibility} projectId={project.id} isCheckedAll={checkedAll}>
            </Conversation>)
  };

  return (
    <Layout>
      {
        loading === false ?
        <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>
          {project?.name}
        </Typography>
        :
        <Skeleton variant="text" width={180} height={36}/>
      }
      <Stack direction={"row"} spacing={3} sx={{ mt: 2 }}>
        <Button component={Link} to={{ pathname: `/projects/${project?.id}/new-conversation`, state: { sources: project?.sources} }} startIcon={<AddIcon />} variant="contained"
          sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none", }}>
          Add conversation
        </Button>
        <Button onClick={deleteConversations} disabled={disabledDelete} startIcon={<DeleteOutlineIcon />} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none", }} >
          Delete
        </Button>
        <CSVLink data={csvData} headers={csvHeaders} filename={`${project?.name} networks.csv`} style={{ textDecoration: 'none' }}>
          <Button onClick={exportNetworksToCSV} disabled={disabledExport} startIcon={<OutputRoundedIcon />} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none", }} >
            Export as CSV
          </Button>
        </CSVLink>
        <Button disabled={disabledCompare} startIcon={<CompareArrowsIcon />} variant="contained"
          sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none" }}
          component={Link} to={{ pathname: `/compare`, state: { compareList: selectedConversations } }} >
          Compare
        </Button>
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Stack sx={{ mt: 1, pr: 2, pl: 2 }} direction={"row"} justifyContent={"space-between"}>
            <OutlinedInput sx={{ width: 500, height: 32 }} placeholder="Find a conversation..." value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearchAndFilter(e.target.value);
              }}
            />
            <IconButton {...bindTrigger(popupState)} color="default">
              <FilterAltOutlinedIcon />
            </IconButton>
            <Menu sx={{ ml: -3 }} {...bindMenu(popupState)}>
              {project?.collaborators.map((collaborator) => {
                return (
                  <MenuItem key={collaborator.id} sx={{ pr: 7 }}>
                    <Checkbox
                      color="default"
                      sx={{ color: "#6366f1" }}
                      checked={!!clCreatedBy[`${collaborator.id}`]}
                      onChange={() => {
                        setClCreatedBy({
                          ...clCreatedBy,
                          [`${collaborator.id}`]: event.target.checked,
                        });
                      }}
                    />
                    <Avatar
                      sx={{ width: 25, height: 25, mr: 2 }}
                      src={collaborator.photoUrl}
                    />
                    <Typography sx={{ wordWrap: "break-word" }}>
                      {collaborator.displayName}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Stack>

          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align={"left"} padding="checkbox" sx={{ minWidth: 70 }}>
                  <Checkbox color='default' sx={{ color: '#6366f1' }} checked={checkedAll} onChange={() => setCheckedAll(event.target.checked)}  />
                </TableCell>
                <TableCell align={"left"} sx={{ minWidth: 130 }}>
                  Title
                </TableCell>
                <TableCell align={"left"} sx={{ minWidth: 130 }}>
                  Description
                </TableCell>
                <TableCell align={"left"} sx={{ minWidth: 80 }}>
                  Received by
                </TableCell>
                <TableCell align={"left"} sx={{ minWidth: 130 }}>
                  Creator
                </TableCell>
                <TableCell align={"left"} sx={{ minWidth: 130 }}>
                  Created
                </TableCell>
                <TableCell align={"left"} sx={{ minWidth: 40 }}></TableCell>
                <TableCell align={"left"} sx={{ minWidth: 40 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                loading === false ?
                (
                  filteredConversations.length > 0 ?
                  filteredConversations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(eachConversation)
                  :
                  <TableRow sx={{ textAlign: 'center', marginLeft: 10, marginRight: 10 }}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Stack sx={{ display:'block', textAlign: 'center'}}>
                      <Inventory2OutlinedIcon sx={{ color: '#d0d0d0', fontSize: 35 }} />
                      <Typography sx={{ color: '#d0d0d0' }}>No Data</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )
                :
                [1,2,3].map((row, i) => <SkeletonTableRow key={i}/> )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={conversations ? conversations.length : 0 }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Layout>
  );
};
export default ProjectPage;
