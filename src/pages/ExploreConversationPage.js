
import React, { useState, useEffect  } from 'react'
import { makeStyles } from '@mui/styles';
import NetworkView from '../components/NetworkView';
import DescriptiveStatistics from '../components/DescriptiveStatistics'
import { Layout } from '../components/Layout'
import { Table } from '../components/Table'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles({
    tabs: {
        "& .MuiTabs-indicator": {
          backgroundColor: "#6366f1",
        },
    },
    tab: {
        textTransform: 'none !important',
        '&.Mui-selected': {
            color: '#6366f1 !important',
        },
    }
  });

const ExploreConversationPage = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <Typography display="inline" sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>{props.location?.state.network.title}</Typography>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} className={classes.tabs}>
                        <Tab label="Network View" value="1" className={classes.tab}  />
                        <Tab label="Descriptive Statistics" value="2" className={classes.tab} />
                    </TabList>
                    </Box>
                    <TabPanel sx={{ pt: 3, pb: 3, pr: 0, pl: 0 }} value="1"><NetworkView network={props.location.state.network}/></TabPanel>
                    <TabPanel sx={{ pt: 3, pb: 3, pr: 0, pl: 0 }} value="2"><DescriptiveStatistics network={props.location.state.network} conversationTitle={props.location?.state.network.title} type={"explore conversation"}/></TabPanel>
                </TabContext>
            </Box>
        </Layout>
    )
}
export default ExploreConversationPage;
