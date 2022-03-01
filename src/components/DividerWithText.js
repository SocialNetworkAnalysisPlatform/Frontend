import React from "react";
import { makeStyles, propsToClassKey } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    height: "70px"
  },
  containerColumn: {
    display: "flex",
    alignItems: "center",
    height: "500px",
    flexDirection: "column"
  },
  border: {
    borderBottom: "1px solid lightgray",
    width: "138px",
  },
  borderLeft: {
    borderLeft: "1px solid lightgray",
    height: "200px",
  },
  content: {
    paddingTop: 0.5,
    paddingBottom: 0.5,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 500,
    fontSize: 14,
    color: "lightgray"
  }
}));

const DividerWithText = (props) => {
 const classes = useStyles();

 return (
  <div className={ props.direction == 'left' ? classes.containerColumn : classes.container }>
    <div className={ props.direction == 'left' ? classes.borderLeft : classes.border } />
    <span className={classes.content}>{props.children}</span>
    <div className={ props.direction == 'left' ? classes.borderLeft : classes.border } />
  </div>
 );
};
export default DividerWithText;