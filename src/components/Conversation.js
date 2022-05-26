
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import dateFormat, { masks } from "dateformat";

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Tooltip from '@mui/material/Tooltip';
import OutlinedInput from "@mui/material/OutlinedInput";

import { db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore"; 

const Conversation = (props) => {
    const [checked, setChecked] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setTitle(props.conversation.title)
        setDescription(props.conversation.description)
    }, []);

    useEffect(() => {
        setChecked(props.isCheckedAll)
    }, [props.isCheckedAll]);

    const handleEditMode = (e) => {
        e.stopPropagation();
        setEditMode(true);
        window.addEventListener("click", saveUpdatedConversation)
    }
    
    const saveUpdatedConversation = () => {
        window.removeEventListener("click", saveUpdatedConversation)
        setEditMode(false);     
    }

    useEffect(() => {
        if(!editMode && title && description) {
            if(title !== props.conversation.title || description !== props.conversation.description ) {
                const conversation = props.conversation;
                conversation.title = title;
                conversation.description = description;
                props.updatedConversation(conversation)
            }
        }
    }, [editMode]);

    const handleChecked = (checkValue) => {
        setChecked(checkValue);
        props.checkedConversation(props.conversation, checkValue)
    }

    const handleVisibility = async(e) => {
        e.preventDefault();
        props.visibility(props.conversation.id, !props.conversation.isPublished)
        const docRef = await setDoc(doc(db, "Conversations", props.conversation.id), {
            isPublished: !props.conversation.isPublished,
          }, {
            merge: true
          });
    }

    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={props.conversation.id} onMouseEnter={ ()=> setDisplayEdit(true)} onMouseLeave={ ()=> setDisplayEdit(false)}>
            <TableCell padding="checkbox">
                <Checkbox color='default' sx={{ color: '#6366f1' }} checked={checked} onChange={() => handleChecked(event.target.checked)}  />
            </TableCell>
            <TableCell align={'left'}>
                {
                    !editMode ?
                    <Link
                        to={{
                            pathname: `/projects/${props.projectId}/conversations/${props.conversation.id}`, 
                            state: { conversation: props.conversation, project: props.project }
                        }} 
                        style={{ textDecoration: "none", color: "#000000DE" ,"&:hover": { color: "#6366f1" }}}>
                        {props.conversation.title}
                    </Link>
                    :
                    <OutlinedInput onClick={(e) => e.stopPropagation() } size="small" required value={title} onChange={(e) => setTitle(e.target.value) }/>
                }
                
            </TableCell>
            <TableCell align={'left'}>
                {
                    !editMode ?
                    props.conversation.description
                    :
                    <OutlinedInput onClick={(e) => e.stopPropagation()} size="small" required value={description} onChange={(e) => setDescription(e.target.value) }/>
                }
            </TableCell>
            <TableCell align={'left'}>{props.conversation.source.owner}</TableCell>
            <TableCell align={'left'}>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                    <Avatar sx={{ width: 25, height: 25 }} src={props.conversation.creator.photoUrl}/>
                    {props.conversation.creator.displayName}
                </Stack>
            </TableCell>
            <TableCell align={'left'}>{dateFormat(new Date(props.conversation.createdAt), "dd/mm/yyyy")}</TableCell>
            <TableCell align={'left'}> 
            {
                props.conversation.isPublished ?
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
            <TableCell align={'left'}> 
            {
                displayEdit &&
                <IconButton color="default" component="span" onClick={handleEditMode}>
                    <ModeEditIcon/>
                </IconButton>
            }
            </TableCell>
    </TableRow>
    )
}
export default Conversation;