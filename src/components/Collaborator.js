
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

const Collaborator = (props) => {

    return (
        <>
            <ListItem>
                <ListItemAvatar>
                    <Avatar alt={`${props.collaborator.name}`} src={props.collaborator.image} />
                </ListItemAvatar>
                <ListItemText primary={`${props.collaborator.name}`} secondary="Collaborator" />
                <IconButton color="default" component="span">
                <DeleteOutlineIcon />
                </IconButton>
            </ListItem>
            { props.index % 2 == 0 && <Divider variant="inset" />}
        </>
    )
}
export default Collaborator;