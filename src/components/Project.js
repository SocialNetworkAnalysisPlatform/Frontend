
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import dateFormat, { masks } from "dateformat";

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

const Project = (props) => {
     return (
        <Box sx={{ mt: 3 }}>
            <Divider light sx={{ mb: 3 }}/>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography component={Link} to={`/projects/${props.project.id}`} sx={{ textDecoration: "none", color: "#000000DE" , fontSize: 20, fontWeight: 500, "&:hover": { color: "#6366f1" }}}>{props.project.name}</Typography>
                <IconButton component={Link} to={{ pathname: `/project-settings`, state: { id: props.project.id, name: props.project.name, description: props.project.description, collaborators: props.project.collaborators, pendingCollaborators: props.project.pendingCollaborators, owner: props.project.owner } }} color="primary" >
                    <SettingsIcon sx={{ color: 'rgba(0, 0, 0, 0.6)', "&:hover": { color: "#6366f1" }}} />
                </IconButton>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    { props.project.collaborated && 
                        <Typography color="textSecondary" sx={{ fontSize: 12, }}>{`Shared from ${props.project.owner.displayName}/${props.project.name}`}</Typography>
                    }
                    <Typography color="textSecondary" sx={{ fontSize: 14, width: '32vw', wordWrap: 'break-word' }}>{props.project.description.length > 170 ? `${props.project.description.substring(0, 170)}...` : props.project.description }</Typography>
                    <Stack direction={"row"} sx={{ mt: 1 }}>
                        <ChatIcon sx={{ mt: 0.4, fontSize: 12, }}/>
                        <Typography color="textSecondary" gutterBottom sx={{ ml: 1 , fontSize: 12, }}>{props.project.conversations ? props.project.conversations.length : '0'}</Typography>
                        <Typography color="textSecondary" sx={{ ml: 3 , fontSize: 12, }}>{`Created at ${dateFormat(new Date(props.project.createdAt), "dd/mm/yyyy")}`}</Typography>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}
export default Project;