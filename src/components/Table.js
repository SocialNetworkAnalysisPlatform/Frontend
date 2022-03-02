
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import Spreadsheet from "react-spreadsheet";


const useStyles = makeStyles({
 
  });

export const Table = (props) => {
    const classes = useStyles();
    const data = [
        [{ value: "Vanilla" }, { value: "Chocolate" }],
        [{ value: "Strawberry" }, { value: "Cookies" }],
      ];

    return (
        <Spreadsheet data={data} />
    )
}
