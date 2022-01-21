
import React, {useState} from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

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
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const NewProject = () => {

  const [newProject, setNewProject] = useState({id: '', shared: false, name: '', description: ''});
  const [collaborators, setCollaborators] = useState([
    // { name:"Linoy" }
  ]);
  const [openModal, setOpenModal] = useState(false);

  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [inputSearchValue, setInputSearchValue] = useState("");

  const modalSstyle = {
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

  const users = [
  { name: 'Hercules', email: 'herc@gmail.com' },
  { name: 'Edgar', email: 'edgar@gmail.com' },
  { name: 'Pikachu', email: 'pikapika@gmail.com' },
  { name: 'Maya', email: 'maya@gmail.com' },
];


  return (
    <>
    <Layout>
        <Box sx={{ width: '50vw' }}>
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Create a new project</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 14 }}>A project contains all conversations files.</Typography>
          <Divider light sx={{ mt: 3, mb: 3 }}/>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel sx={{ color: '#000000DE', fontSize: 14, fontWeight: 500 }}>Project name</FormLabel>
              <OutlinedInput size="small" sx={{ width: 300,  }} required value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value}) }/>
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: '#000000DE', fontSize: 14, fontWeight: 500}}>Description (optional)</FormLabel>
              <OutlinedInput size="small" sx={{ width: '50vw' }} required value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value}) }/>
            </FormControl>
          </Stack>
          <Divider light sx={{ mt: 3, mb: 3 }}/>
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Collaborators</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(0, 0, 0, 0.2)',  borderRadius: 2, minHeight: 200,}}>
          {
            collaborators.length > 0 ?
            <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Collaborators</Typography>
            : 
            <Stack sx={{alignItems: 'center'}} spacing={2}>
              <GroupsIcon sx={{ fontSize: 50, fontWeight: 500, color: "#6366f1" }}/>
              <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#000000DE" }}>You have not invited any collaborators yet</Typography>
              <Button onClick={() => setOpenModal(true)} startIcon={<AddIcon />} variant="outlined" sx={{ color: '#6366f1', borderColor: '#6366f1', "&:hover": { backgroundColor: '#ededff', borderColor: '#6366f1' }, textTransform: 'none' }} >
                  Add
              </Button>
            </Stack>
          }
          </Box>
        </Box>
    </Layout>
    <Modal open={openModal} onClose={() => setOpenModal(false)} > 
        <Stack sx={modalSstyle} >
          <Box sx={{ textAlign:'right', mt: -2 }}>
            <IconButton onClick={() => setOpenModal(false)} color="default" aria-label="upload picture" component="span">
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
            options={users}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder='Search by name or email'/>
            )}
          />
          <Button onClick={() => setOpenModal(false)} variant="contained" sx={{ mt: 3,  backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none",}} >
            Select 
          </Button>
        </Stack>
      </Modal>
    </>
  )
}
export default NewProject;

