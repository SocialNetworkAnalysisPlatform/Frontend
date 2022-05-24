
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import fileIcon from '../assets/images/txt-file.png';
import Radio from '@mui/material/Radio';

const useStyles = makeStyles({
    fileBorder: {
        boxShadow: ({props, isSelected}) => (props.groupSelected == props.file) && isSelected ? 'inset 0 0 0 2px #6366f1' : '',
        cursor: 'pointer',
        "&:hover": {
            boxShadow: 'inset 0 0 0 2px #6366f1'
        },
    }
});

export const File = (props) => {
    const [isSelected, setIsSelected] = useState(false)
    const classes = useStyles({props, isSelected});

    useEffect(() => {
        if(isSelected) {
            props.selected(props.file)
        }
        else {
            if(props.groupSelected == props.file) {
                props.selected(null)
            }
        }
    }, [isSelected]);

    useEffect(() => {
        if(props.groupSelected != props.file) {
            setIsSelected(false)
        }
    }, [props.groupSelected]);

    return (
        <Box onClick={() => { setIsSelected(!isSelected)}} className={classes.fileBorder} p={2} m={1}>
            <Box sx={{backgroundImage: `url(${fileIcon})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: 35, height: 35}}/>
            <Typography>{ props.file.name }</Typography>
        </Box>
    )
}
