import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { storage } from "../utils/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

import { makeStyles } from '@mui/styles';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ClipLoader from "react-spinners/ClipLoader";

import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  label: {
    fontSize: 14,
    fontWeight: 500,
    "&.Mui-focused": {
      color: '#6366f1 !important'
    },
  },
  field: {
      width: 450,
      height: 40,
      "&.MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: '#6366f1 !important'
          }
      },
  }
});

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 30,
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  width: 385,
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default function Dropzone(props) {
  const history = useHistory();
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fileOwner, setFileOwner] = useState('');
  const [fileDateFormat, setFileDateFormat] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!props.newConversation || !file) {
      alert("Please select a conversation to import and fill all the missing fields");
      return;
    }

    if (props.newConversation) {
      const isTitleValid = props.newConversation.title && props.newConversation.title.length > 0;
      const isDescriptionValid = props.newConversation.description && props.newConversation.description.length > 0;
      const isFileOwnerValid = fileOwner && fileOwner.length > 0;

      if (!isTitleValid || !isDescriptionValid || checked && !isFileOwnerValid) {
        alert("Please fill all the missing fields");
        return;
      }
    }
    setLoading(true);

    const projectId =  window.location.pathname.split("/")[2]; // TODO: Verify if there is project id
    const conversationId = props.newConversation.id; 
    const fileName = file.name;
    const filePath = `Conversations/${conversationId}/`;

    
    const storageRef = ref(storage, `${filePath}${fileName}`);
    const uploadFile = uploadBytesResumable(storageRef, file);
    uploadFile.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log(error);
      },
      async () => {
        // On complete

        const conversation = {
          title: props.newConversation.title,
          description: props.newConversation.description,
          fileOwner: fileOwner,
          creator: currentUser.uid,
          futureUse: checked,
          projectId,
          conversationId,
          conversationFile: { fileName, filePath, fileDateFormat: fileDateFormat, isFromSources: false },
        }
        console.log(conversation);

        await fetch(`https://europe-west1-snaplatform.cloudfunctions.net/getMinMaxDates`, {
           method: "POST",
           body: JSON.stringify({ 
             conversation
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
               // Convert from Unix Timestamp to Date Format
              const dates = {
                min: new Date(Number(response.dates.min)).setHours(0,0,0,0),
                max: new Date(Number(response.dates.max)).setHours(0,0,0,0)
              }
              props.minMaxDates(dates);
              props.uploadedConversation(conversation);
              setLoading(false);
              props.openModal(true);
              console.log("File uploaded");
             }
          })
           .catch(error => {
             console.error("Error:", error)
            });
      }
    );

  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      setFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, minSize: 1, maxSize: 104857600, maxFiles: 1, accept: ["text/plain"] }); //Max size 100 megabytes  //Add for telegram ,'application/json'

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <>
    <Stack gap={2}>
      <FormControl>
        <FormLabel className={classes.label}>Received by</FormLabel>
        <OutlinedInput size="small" className={classes.field} required value={fileOwner} onChange={(e) => setFileOwner(e.target.value) }/>
      </FormControl>
      <FormControl>
        <FormLabel className={classes.label}>Select a date format according to the date listed in the conversation</FormLabel>
        <Select
          value={fileDateFormat}
          onChange={(event) => setFileDateFormat(event.target.value)}
          className={classes.field}
        >
          <MenuItem value={"DMY"}>dd/mm/yyyy</MenuItem>
          <MenuItem value={"MDY"}>mm/dd/yyyy</MenuItem>
          <MenuItem value={"other"}>Other</MenuItem>
        </Select>
        <Box>
          <Typography display="inline" sx={{ color: 'red', fontSize: 11 }}>Warning: </Typography>
          <Typography display="inline" sx={{ color: '#666666', fontSize: 11 }}>selecting a false date format of the conversation will lead to incorrect results</Typography>
        </Box>
      </FormControl>
      <Box {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {file ? (
          <p>
            {file.name} ({formatBytes(file.size)})
          </p>
        ) : (
          <Box>
            <p>Drop conversation here</p>
            {/* <em>Only *.txt will be accepted (100MB Limit)</em> */}
          </Box>
        )}
      </Box>
      <FormControlLabel
        label="Save the conversation for future use"
        control={<Checkbox color='default' sx={{ color: '#6366f1' }} checked={checked} onChange={() => setChecked(event.target.checked)} />}
      />
      <Stack direction="row" gap={2}>
        <Button onClick={handleUpload} disabled={false} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 80, textTransform: "none", }} > Import </Button>
      </Stack>
    </Stack>
    {
      loading ? 
      <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <ClipLoader color={'#6366F1'} loading={loading} size={100} />
      </Box>
      :
      ''
    }
 
    </>
  );
}
