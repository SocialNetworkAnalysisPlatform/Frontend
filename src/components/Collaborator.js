
import React, { useState } from 'react'
import { Layout } from '../components/Layout'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';

import { useAuth } from '../contexts/AuthContext'


const Collaborator = (props) => {
    const handleDelete = () => {
        props.delete(props.collaborator.id)
    };
    const { currentUser } = useAuth();

    return (
        <>
            <ListItem>
                <ListItemAvatar>
                    <Avatar alt={`${props.collaborator.displayName}`} src={props.collaborator.photoUrl} />
                </ListItemAvatar>
                <ListItemText primary={`${props.collaborator.displayName}`} secondary="Collaborator" />
                {(currentUser.uid === props.collaborator.id ||  currentUser.uid === props.ownerId) &&
                <IconButton onClick={handleDelete} color="default" component="span">
                    <DeleteOutlineIcon />
                </IconButton>}
            </ListItem>
            { props.index != props.amount-1 && <Divider variant="inset" />}
        </>
    )
}
export default Collaborator;