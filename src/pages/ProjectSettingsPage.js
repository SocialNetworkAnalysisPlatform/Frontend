
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import { Layout } from '../components/Layout'
import Collaborator from '../components/Collaborator';
import { useAuth } from '../contexts/AuthContext'
import List from '@mui/material/List';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import { db, rtdb } from "../utils/firebase";
import { doc, setDoc, deleteDoc, arrayRemove, arrayUnion } from "firebase/firestore"; 
import { ref, onValue, remove } from "firebase/database";

import { Link, useHistory, useLocation } from "react-router-dom";
import { propsToClassKey } from '@mui/styles';
import Service from '../utils/service'

const service = Service.getInstance();

const useStyles = makeStyles({

});

const ProjectSettingsPage = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { currentUser } = useAuth();
  
  const [currProject, setNewProject] = useState({
    id: props.location?.state.id,
    shared: false,
    name: props.location?.state.name,
    description: props.location?.state.description,
    conversations: props.location?.state.conversations
  });

  const [users, setUsers] = useState([]);
  const [collaborator, setCollaborator] = useState();
  const [collaborators, setCollaborators] = useState([]);
  const [openAddCollaboratorModal, setOpenAddCollaboratorModal] = useState(false);
  const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [disabledSelect, setDisabledSelect] = useState(true);
  const [disabledDelete, setDisabledDelete] = useState(true);
  const [deleteProjectInput, setDeleteProjectInput] = useState("");


  
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 10,
    borderRadius: 2,
    p: 4,
  };
  const setProject = async (e) => {
    e.preventDefault();

    if(currProject.name !== '') {
      try {
          await setDoc(doc(db, "Projects", currProject.id), {
            name: currProject.name,
            description: currProject.description,
          }, {
            merge: true
          });

         history.replace(location.state?.from ?? "/projects");
        
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } else {
        alert("Project name missing, can't save project");
      }
  }
  
 
  useEffect(async () => {
    const collaborators = props.location?.state.collaborators;
    if(collaborators && collaborators.length > 0) {

      const collaboratorsData = await Promise.all(collaborators?.map(async(collaborator) => {
            const data = await service.readUserData(collaborator);
            return {
                id: collaborator,
                ...data
            };
        })
    );
    setCollaborators(collaboratorsData);
    }

}, [])

useEffect(() => {
  const dbRef = ref(rtdb, 'Users/');
  const unsub = onValue(dbRef, async (snapshot) => {
    const data = snapshot.val();
    let users = Object.entries(data).map(([key, value]) => ({ id: key , ...value}));
    users = users.filter((user) => user.id !== currentUser.uid && user.id !== props.location?.state.owner.id
    && !props.location?.state.collaborators.includes(user.id) && !props.location?.state.pendingCollaborators.includes(user.id))
    setUsers(users);
  });

  return () => {
    unsub();
  };
}, []);

 // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
}, [])

const handleDeleteProject = async(e) => {
  e.preventDefault();

  try {

    if(currProject.conversations && currProject.conversations.length > 0) {
    await Promise.all(
      currProject.conversations.map(async(conversation) => {
        const conversationId = conversation.split('/').pop();
        await remove(ref(rtdb, 'Conversations/' + conversationId));
      }));

    await Promise.all(
      currProject.conversations.map(async(conversation) => {
        const conversationId = conversation.split('/').pop();
        return deleteDoc(doc(db, "Conversations", conversationId));
      })
    );
    }
    await deleteDoc(doc(db, "Projects", currProject.id));

    history.replace(location.state?.from ?? "/projects");

  } catch (error) {
    console.error(error);
  }

}

  useEffect(() => {
    if(deleteProjectInput === currProject.name) {
      setDisabledDelete(false)
    } else {
      setDisabledDelete(true)
    }
  }, [deleteProjectInput])


  const deleteCollaborator = async (id) => {
    setCollaborators(prevState => (
      prevState.filter((collaborator) => collaborator.id !== id)
  ))
  await setDoc(doc(db, "Projects", currProject.id), { 
    collaborators: arrayRemove(id)
  }, {
    merge: true
  });
  if(props.location?.state.owner.id !== currentUser.uid ) {
    history.replace(location.state?.from ?? "/projects");
  }
  };

  const eachCollaborator = (item, index) => {
    return  (<Collaborator key={item.id} index={index} ownerId={props.location?.state.owner.id} collaborator={item} amount={collaborators.length} delete={deleteCollaborator}></Collaborator>)
  };

  const handleSelect = async (event, value) => {
    setOpenAddCollaboratorModal(false);
   
    if(collaborator) {
      if(collaborators.find(collaboratorOption => collaboratorOption.id === collaborator.id)) {
        console.log("Collaborator already exists");
      } else {
      setCollaborators(prevState => ([
        ...prevState, 
           collaborator     
        ]));
        await setDoc(doc(db, "Projects", currProject.id), { 
          pendingCollaborators: arrayUnion(collaborator.id)
        }, {
          merge: true
        });

        const collaboration = {
          pendingCollaborator: collaborator,
          projectName: currProject.name,
          projectId: currProject.id,
        }

        await fetch(`https://europe-west1-snaplatform.cloudfunctions.net/inviteCollaborators`, {
          method: "POST",
          body: JSON.stringify({
            collaboration,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
          .then(response =>
            response.json())
          .then(response => {
            if (!response?.status) {
            } else {
            }
          })
          .catch(error => {
            console.error("Error:", error)
          });
        
      setCollaborator(null);
    } 
    }
  };

  return (
    <>
      <Layout>
          <Box sx={{ width: '50vw' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Project Settings</Typography>
            <Typography color="textSecondary" sx={{ fontSize: 14 }}>A project contains all conversations files.</Typography>
            <Divider light sx={{ mt: 3, mb: 3 }}/>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel sx={{ color: '#000000DE', fontSize: 14, fontWeight: 500 }}>Project name</FormLabel>
                <OutlinedInput classes={classes.input} size="small" sx={{ width: 300, backgroundColor: 'white' }} required value={currProject.name} onChange={(e) => setNewProject({...currProject, name: e.target.value}) }/>
              </FormControl>
              <FormControl>
                <FormLabel classes={classes.input} sx={{ color: '#000000DE', fontSize: 14, fontWeight: 500}}>Description (optional)</FormLabel>
                <OutlinedInput size="small" sx={{ width: '50vw', backgroundColor: 'white' }} required value={currProject.description} onChange={(e) => setNewProject({...currProject, description: e.target.value}) }/>
              </FormControl>
              
              <Button onClick={(e) => setProject(e)} variant="contained" sx={{backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 100, textTransform: "none",}} >
                Save
              </Button>
            </Stack>

            <Divider light sx={{ mt: 3, mb: 3 }}/>

            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Collaborators</Typography>
              { // Show button depending on collaborators array length > 0 (true case)
                collaborators.length > 0 && currentUser.uid === props.location?.state.owner.id &&
                <Button onClick={() => setOpenAddCollaboratorModal(true)} startIcon={<AddIcon />} variant="contained" sx={{backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none",}} >
                  Add 
                </Button>
              }
            </Stack>   

            <Box sx={{ mt: 2, minHeight: 170, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(0, 0, 0, 0.2)',  borderRadius: 2, backgroundColor: 'white' }}>
            { // Show items depending on collaborators array length (ternary expression - true and false case)
              collaborators.length > 0
              ?
              <List sx={{ width: '100%', bgcolor: 'background.paper'}}>
                { collaborators.map(eachCollaborator) }
              </List>
              : 
              <Stack sx={{alignItems: 'center', mt: 4, mb: 4}} spacing={2}>
                <GroupsIcon sx={{ fontSize: 50, fontWeight: 500, color: "#6366f1" }}/>
                <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#000000DE" }}>You have not invited any collaborators yet</Typography>
                <Button onClick={() => setOpenAddCollaboratorModal(true)} startIcon={<AddIcon />} variant="outlined" sx={{ color: '#6366f1', borderColor: '#6366f1', "&:hover": { backgroundColor: '#ededff', borderColor: '#6366f1' }, textTransform: 'none', height: 32 }} >
                    Add
                </Button>
              </Stack>
            }
            </Box>
            
            <Divider light sx={{ mt: 3, mb: 3 }}/>

            {
              (currentUser.uid === props.location?.state.owner.id) ?
              <Box>
                <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Danger Zone</Typography>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Delete this project</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: 14 }}>Once you delete a project, there is no going back. Please be certain.</Typography>
                  </Box>        
                  <Button onClick={() => setOpenDeleteProjectModal(true)} startIcon={<DeleteOutlineIcon />} variant="outlined" sx={{ color: '#cf222e', borderColor: '#cf222e', "&:hover": { backgroundColor: '#cf222e', borderColor: '#cf222e', color: 'white' }, textTransform: 'none', height: 32}} >
                    Delete this project 
                  </Button>         
                </Stack>   
              </Box>
              :
              ''
            }
           
          </Box>
      </Layout>

      <Modal open={openAddCollaboratorModal} onClose={() => setOpenAddCollaboratorModal(false)} > 
        <Stack sx={modalStyle} >
          <Box sx={{ textAlign:'right', mt: -2 }}>
            <IconButton onClick={() => setOpenAddCollaboratorModal(false)} color="default" component="span">
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#000000DE" }}>Add a collaborator to your project</Typography>
        
           <Autocomplete open={openAutocomplete} sx={{ mt: 2 }} 
            onOpen={() => {
              if (inputSearchValue) {
                setOpenAutocomplete(true);
              }
            }}
            onClose={() => setOpenAutocomplete(false)}
            inputValue={inputSearchValue}
            onInputChange={(e, value, reason) => {
              setInputSearchValue(value);
              if (!value) {
                setOpenAutocomplete(false);
              }
            }}
            onChange={(e, value, reason) => {
              setCollaborator(value);
              setDisabledSelect(false)
              if (!value) {
                setDisabledSelect(true)
              }
            }}
            options={users}
            getOptionLabel={(option) => option.email}
   
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder='Search by email'/>
            )}
          /> 
          
          <Button disabled={disabledSelect} onClick={handleSelect} variant="contained" sx={{ mt: 3,  backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none",}} >
            Select 
          </Button>
        </Stack>
      </Modal>

      <Modal open={openDeleteProjectModal} onClose={() => setOpenDeleteProjectModal(false)} > 
        <Stack spacing={2} sx={modalStyle} >
          <Box sx={{ textAlign:'right', mt: -2 }}>
            <IconButton onClick={() => setOpenDeleteProjectModal(false)} color="default" component="span">
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#000000DE" }}>{`Are you sure to delete ${currProject.name} project?`}</Typography>
          <Box>
            <Typography display="inline">{`This action cannot be undone. This will permanently delete the `}</Typography>
            <Typography display="inline" sx={{ fontWeight: 700 }}>{currProject.name}</Typography>
            <Typography display="inline">{` project.`}</Typography>
          </Box>
          <Box>
            <Typography display="inline">{`Please type `}</Typography>
            <Typography display="inline" sx={{ fontWeight: 700 }}>{currProject.name}</Typography>
            <Typography display="inline">{` to confirm.`}</Typography>
          </Box>
          <OutlinedInput classes={classes.input} size="small" sx={{ width: '100%', backgroundColor: 'white' }} required value={deleteProjectInput} onChange={(e) => setDeleteProjectInput( e.target.value) }/>
          <Button onClick={handleDeleteProject} disabled={disabledDelete} variant="outlined" sx={{ color: '#cf222e', borderColor: '#cf222e', "&:hover": { backgroundColor: '#cf222e', borderColor: '#cf222e', color: 'white' }, textTransform: 'none', height: 32}} >
              Delete this project 
          </Button>
        </Stack>
      </Modal>
    </>
  )
}
export default ProjectSettingsPage;

