
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import NewWindow from 'react-new-window'


const useStyles = makeStyles({
 
  });

const CompareTable = (props) => {
    const classes = useStyles();

   

    return (
        <NewWindow features={{ width: 900, height: 900,}} title="Networks Comparison Table">

        </NewWindow>

    )
}
export default CompareTable;