
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';

import { Layout } from '../components/Layout'
import { Table } from '../components/Table'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const useStyles = makeStyles({
    tabs: {
        "& .MuiTabs-indicator": {
          backgroundColor: "#6366f1",
        },
    },
    tab: {
        textTransform: 'none',
        '&.Mui-selected': {
            color: '#6366f1',
        },
    }
  });

const NetworkPage = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <Layout>
             <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} className={classes.tabs}>
                        <Tab label="Network" value="1" className={classes.tab}  />
                        <Tab label="Table" value="2" className={classes.tab}  />
                        <Tab label="Item Three" value="3" className={classes.tab} />
                    </TabList>
                    </Box>
                    <TabPanel value="1">Item One</TabPanel>
                    <TabPanel value="2"><Table/></TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                </TabContext>
            </Box>
        </Layout>
    )
}
export default NetworkPage;