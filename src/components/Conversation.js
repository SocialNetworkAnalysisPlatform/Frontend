
import React, { useState } from 'react'
import { Layout } from './Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import dateFormat, { masks } from "dateformat";

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Tooltip from '@mui/material/Tooltip';

const Conversation = (props) => {
    const [checked, setChecked] = useState(false);

    const handleChecked = (checkValue) => {
        setChecked(checkValue);
        props.checkedNetwork(props.network, checkValue)
    }

    const handleVisibility = () => {
        props.visibility(props.network.id, !props.network.isPublished)
    }

    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={props.network.id} >
            <TableCell padding="checkbox">
                <Checkbox color='default' sx={{ color: '#6366f1' }} checked={checked} onChange={() => handleChecked(event.target.checked)}  />
            </TableCell>
            <TableCell align={'left'}>
                <Link
                    to={{
                        pathname: `/conversations/${props.network.id}`, 
                        state: { network: props.network, project: props.project }
                    }} 
                    style={{ textDecoration: "none", color: "#000000DE" ,"&:hover": { color: "#6366f1" }}}>
                    {props.network.title}
                </Link>
            </TableCell>
            <TableCell align={'left'}>{props.network.description}</TableCell>
            <TableCell align={'left'}>{props.network.source.owner}</TableCell>
            <TableCell align={'left'}>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                    <Avatar sx={{ width: 25, height: 25 }} src={props.network.creator.photoUrl}/>
                    {props.network.creator.displayName}
                </Stack>
            </TableCell>
            <TableCell align={'left'}>{dateFormat(new Date(props.network.createdAt), "dd/mm/yyyy")}</TableCell>
            <TableCell align={'center'}> 
            {
                props.network.isPublished ?
                <Tooltip title="Click to unshare with the community" arrow placement="right">
                    <IconButton color="default" component="span" onClick={handleVisibility}>
                        <VisibilityOutlinedIcon/>
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title="Click to share with the community" arrow placement="right">
                    <IconButton color="default" component="span" onClick={handleVisibility}>
                        <VisibilityOffOutlinedIcon/>
                    </IconButton>
                </Tooltip>
            }
            </TableCell>
    </TableRow>
    )
}
export default Conversation;