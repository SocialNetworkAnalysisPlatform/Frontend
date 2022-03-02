
import React, { useState, useEffect  } from 'react'
import { Layout } from '../components/Layout'
import { File } from '../components/File'
import RadioGroup from '@mui/material/RadioGroup';

import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Dropzone from '../components/Drop'
import DividerWithText from '../components/DividerWithText'

const NewConversationPage = (props) => {

    const [selectedFile, setSelectedFile] = useState();
    console.log("selectedFile", selectedFile)

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

    
    
    return (
        <Layout>
            <Stack direction={"row"} gap={5}>
                <Box>
                    <Typography sx={{ mb: 3, fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Import a new conversation</Typography>
                    <Dropzone/>
                </Box>
                <DividerWithText direction="left">OR</DividerWithText>
                <Box>
                    <Typography sx={{ mb: 3, fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Import conversation from your sources</Typography>
                    <Box sx={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                        { files.map(eachFile) }
                    </Box>
                </Box>
            </Stack>
        </Layout>
    )
}
export default NewConversationPage;