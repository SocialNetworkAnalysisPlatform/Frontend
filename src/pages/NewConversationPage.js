import React, { useState, useEffect  } from 'react'
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Layout } from '../components/Layout'
import { File } from '../components/File'
import RadioGroup from '@mui/material/RadioGroup';

import { useAuth } from '../contexts/AuthContext'
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dropzone from '../components/Drop'
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dateFormat, { masks } from "dateformat";

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
    const history = useHistory();
    const [selectedFile, setSelectedFile] = useState();
    const [checked, setChecked] = useState(true);
    const [newConversation, setNewConversation] = useState({id: uuidv4().slice(0, 20), title: '', description: '', file: selectedFile});
    const [uploadedConversation, setUploadedConversation] = useState();

    const [openModal, setOpenModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minMaxDates, setMinMaxDates] = useState();
    
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

    const handleConfirm = async(e) => {
      e.preventDefault();
      if(uploadedConversation) {
        await fetch(`https://europe-west1-snaplatform.cloudfunctions.net/importConversation`, {
          method: "POST",
          body: JSON.stringify({ 
            conversation: {
              minDate: dateFormat(new Date(startDate), "mm/dd/yyyy"),
              maxDate: dateFormat(new Date(endDate), "mm/dd/yyyy"),
              ...uploadedConversation
            }
         }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
          .then(response =>
            response.json())
          .then(response => {
            console.log(response);
            if(!response?.status) {
             alert("File upload failed due it's content, please select another file");
            } else {
              setOpenModal(false);
              history.replace(location.state?.from ?? `/projects/${uploadedConversation.projectId}`);
              console.log("File uploaded");
            }
         })
          .catch(error => {
            console.error("Error:", error)
           });
      }

    }

    const eachFile = (item, index) => {
        return ( <File key={item.id} index={index} file={item} groupSelected={selectedFile} selected={(id) => setSelectedFile(id)}></File> )
    };

    const device = () => {
        return (
            <Stack p={2} spacing={1}>
                <Typography sx={{ mb: 3, fontSize: 18, fontWeight: 500, color: "#6366f1" }}>Import a new conversation from your device</Typography>
                <Dropzone newConversation={newConversation} openModal={(value) => setOpenModal(value)} minMaxDates={(dates) => setMinMaxDates(dates)} uploadedConversation={(conversation) => setUploadedConversation(conversation)}/>
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

      // Scroll to top on page load
      useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    
    return (
      <>
        <Layout>
            <Stack spacing={2}>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#6366f1" }}>Create a New Conversation</Typography>

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

            {
              minMaxDates &&
              <Modal open={openModal} onClose={() => setOpenModal(false)} >
              <Stack sx={modalStyle} spacing={2}>
                <Box sx={{ textAlign: 'right', mt: -2 }}>
                  <IconButton onClick={() => setOpenModal(false)} color="default" component="span">
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#000000DE" }}>Select desired dates for analyzing</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    minDate={new Date(minMaxDates.min)}
                    maxDate={new Date(minMaxDates.max)}
                    value={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    minDate={new Date(minMaxDates.min)}
                    maxDate={new Date(minMaxDates.max)}
                    value={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Button onClick={handleConfirm} variant="contained" sx={{ mt: 3, backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none", }} >
                  Confirm
                </Button>
              </Stack>
            </Modal>
            }
      
      </>
    )
}
export default NewConversationPage;