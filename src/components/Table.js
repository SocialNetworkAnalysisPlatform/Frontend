
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import Papa from "papaparse";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spreadsheet from "react-spreadsheet";
import Stack  from '@mui/material/Stack';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";


const useStyles = makeStyles({
 
  });

export const Table = (props) => {
    const classes = useStyles();
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadURL, setDownloadURL] = useState('');

    useEffect(() => {
      const path = props.network.source.storageProcessedPath;
      const storage = getStorage();
      getDownloadURL(ref(storage, path))
        .then((url) => {
          // `url` is the download URL
          setDownloadURL(url)
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
              Papa.parse(blob, {
              delimiter: "",
              chunkSize: 3,
              header: false,
              complete: (responses) => {
                // console.log(responses.data);
                let newData = [];
                responses.data.forEach((row) =>{
                  let newRow = []
                  row.forEach((column) =>{
                    newRow.push({ value: column })
                  });
                  newData.push(newRow)
                });
                setCsvData(newData)
                setLoading(false)
              }
            });
          };
          xhr.open('GET', url);
          xhr.send();
        })
        .catch((error) => {
          // Handle any errors
        });

  }, []);


    return (
      <Stack spacing={3}>
        {
          loading === false ?
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<DownloadIcon/>}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href=downloadURL;
                }}
                sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, width: 160, textTransform: "none", }}>
                    Download CSV
              </Button>
            </Box>
            <Box sx={{ maxHeight: '54vh', overflowY: 'auto' }}>
              <Spreadsheet data={csvData} />
            </Box>
          </>
          :
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 15}}>
            <ClipLoader color={'#6366F1'} loading={loading} size={100} />
          </Box>
        }  
      </Stack>
    )
}
