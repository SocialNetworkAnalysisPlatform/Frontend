import React, { useState, useEffect  } from 'react'
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Layout } from '../components/Layout'
import { File } from '../components/File'
import RadioGroup from '@mui/material/RadioGroup';

import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Dropzone from '../components/Drop'
import DividerWithText from '../components/DividerWithText'
import Switch from '@mui/material/Switch';
import { v4 as uuidv4 } from 'uuid';

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#6366f1' : '#6366f1',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#6366f1' : '#6366f1',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  const useStyles = makeStyles({
    label: {
      fontSize: 14,
      fontWeight: 500,
      "&.Mui-focused": {
        color: '#6366f1 !important'
      },
    },
    field: {
        width: '35vw',
        "&.MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: '#6366f1 !important'
            }
        },
    }
  });
  
const NewConversationPage = (props) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    const [checked, setChecked] = useState(true);
    const [newConversation, setNewConversation] = useState({id: uuidv4().slice(0, 20), title: '', description: '', file: selectedFile});


    const [files, setFiles] = useState([
        { id: 1, name: "File1"},
        { id: 2, name: "File2"},
        { id: 3, name: "File3"},
        { id: 4, name: "File4"},
        { id: 5, name: "File5"},
        { id: 6, name: "File6"},
        { id: 7, name: "File7"},
        { id: 8, name: "File8"},

    ]);

    const eachFile = (item, index) => {
        return ( <File key={item.id} index={index} file={item} groupSelected={selectedFile} selected={(id) => setSelectedFile(id)}></File> )
    };

    const device = () => {
        return (
            <Stack p={2} spacing={1}>
                <Typography sx={{ mb: 3, fontSize: 18, fontWeight: 500, color: "#6366f1" }}>Import a new conversation from your device</Typography>
                <Dropzone newConversation={newConversation}/>
            </Stack>
        )
    }

    const sources = () => {
        return (
            <Stack p={2} spacing={1}>
                <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#6366f1" }}>Import conversation from your sources</Typography>
                <Box sx={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                    { files.map(eachFile) }
                </Box>
                <Button disabled={false} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 80, textTransform: "none",}} > Import </Button>
            </Stack>
        )
    }

    
    
    return (
        <Layout>
            <Stack spacing={2}>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#6366f1" }}>Create a new conversation</Typography>

            <Paper elevation={2}>
              <Stack spacing={4} p={2}>
                <FormControl>
                  <FormLabel className={classes.label} >Title</FormLabel>
                  <OutlinedInput size="small" className={classes.field} required value={newConversation.title} onChange={(e) => setNewConversation({...newConversation, title: e.target.value}) }/>
                </FormControl>
                <FormControl>
                  <FormLabel className={classes.label}>Description</FormLabel>
                  <OutlinedInput size="small" className={classes.field} required multiline maxRows={2} value={newConversation.description} onChange={(e) => setNewConversation({...newConversation, description: e.target.value}) }/>
                </FormControl>
              </Stack>
            </Paper>
            <Paper elevation={2}>
                <Stack direction="row" spacing={1} p={2} alignItems="center">
                    <Typography sx={{ mr: 6, fontSize: 18, fontWeight: 500, color: "#6366f1" }}>Please choose import method</Typography>
                    <Typography>Sources</Typography>
                    <IOSSwitch checked={checked} onChange={(event) => setChecked(event.target.checked)} sx={{ m: 1 }} />
                    <Typography>Device</Typography>
                </Stack>
            </Paper>
            <Paper elevation={2}>
            {
                checked ? device() : sources()
            }
            </Paper>
            </Stack>
                
                
        </Layout>
    )
}
export default NewConversationPage;