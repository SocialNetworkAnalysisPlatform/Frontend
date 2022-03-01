
import React, { useState, useEffect  } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Dropzone from '../components/Drop'
import DividerWithText from '../components/DividerWithText'

const NewConversationPage = (props) => {
    
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
                </Box>
            </Stack>
        </Layout>
    )
}
export default NewConversationPage;