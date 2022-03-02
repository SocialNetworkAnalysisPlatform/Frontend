import { useMemo, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { storage } from "../utils/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  width: 400,
  height: 200,
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
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [disabledUpload, setDisabledUpload] = useState(true);
  const [checked, setChecked] = useState(false);


  const handleUpload = (e) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    console.log("Uploading");

    const filePath = `Projects/projectid/userid/${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadFile = uploadBytesResumable(storageRef, file);

    uploadFile.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        // On complete
        await fetch(`https://europe-west1-snaplatform.cloudfunctions.net/function-1`, {
          method: "POST",
          body: JSON.stringify({filePath}), 
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }})
          .then(response =>
            response.json())
          .then(response => {
              console.log(response);
          })
          .catch(error => console.error("Error:", error));
      }
    );
    
  };

  useEffect(() => {
    console.log(file);
  }, [file]);

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

  const CircularProgressWithLabel = (props) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" {...props} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(props.value)}%`}
            </Typography>
          </Box>
        </Box>
      );
  }

  return (
    <Stack gap={2}>
        <Box {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {file ? (
            <p>
                {file.name} ({formatBytes(file.size)})
            </p>
            ) : (
            <Box>
                <p>Drop conversation here</p>
                <em>Only *.txt will be accepted (100MB Limit)</em>
            </Box>
            )}
        </Box>
        <FormControlLabel
            label="Save the conversation for future use"
            control={<Checkbox color='default' sx={{ color: '#6366f1' }} checked={checked} onChange={() => setChecked(event.target.checked)} />}
        />
        <Stack direction="row" gap={2}>
            <Button onClick={handleUpload} disabled={false} variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 80, textTransform: "none",}} > Import </Button>
            { progress > 0 && <CircularProgressWithLabel value={progress} /> }
        </Stack>
    </Stack>
  );
}
