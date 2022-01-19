import React from "react";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    height: "70px"
  },
  border: {
    borderBottom: "1px solid lightgray",
    width: "138px"
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

const DividerWithText = ({ children }) => {
 const classes = useStyles();
 return (
  <div className={classes.container}>
    <div className={classes.border} />
    <span className={classes.content}>{children}</span>
    <div className={classes.border} />
  </div>
 );
};
export default DividerWithText;