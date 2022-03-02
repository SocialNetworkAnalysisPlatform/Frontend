
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import fileIcon from '../assets/images/txt-file.png';
import Radio from '@mui/material/Radio';

const useStyles = makeStyles({
    fileBorder: {
        boxShadow: props => props.groupSelected == props.file.id ? 'inset 0 0 0 2px #6366f1' : '',
        cursor: 'pointer',
        "&:hover": {
            boxShadow: 'inset 0 0 0 2px #6366f1'
        },
    }
});

export const File = (props) => {
    const classes = useStyles(props);

    return (
        <Box onClick={() => props.selected(props.file.id)} className={classes.fileBorder} p={3}>
            <Box sx={{backgroundImage: `url(${fileIcon})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: 35, height: 35}}/>
            <Typography>{ props.file.name }</Typography>
        </Box>
    )
}
