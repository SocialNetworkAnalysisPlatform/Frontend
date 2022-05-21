import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { NavLink, useHistory } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';

import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ExploreTwoToneIcon from '@mui/icons-material/ExploreTwoTone';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import Logo from '../assets/images/snap-logo-appbar.png';

const DRAWER_WIDTH = 220;

export const Navbar = () => {
  const { logout, currentUser } = useAuth()
  const history = useHistory();

  const handleRedirectToOrBack = () => {
    history.replace(location.state?.from ?? "/projects");
  }

  if (currentUser) {
  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#ffffff', boxShadow: '0 2px 15px 0 rgb(0 0 0 / 5%)' }}>
        <Toolbar variant="dense" sx={{justifyContent: "space-between"}}>
            <Box sx={{ml: -1.4, backgroundImage: `url(${Logo})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: '120px', height: '50px'}}/>
            <Button component={NavLink} to="/" variant="outlined" sx={{ color: '#6366f1', borderColor: '#6366f1', "&:hover": { backgroundColor: '#ededff', borderColor: '#6366f1' }, textTransform: 'none'}}
            onClick={ e => {
              e.preventDefault()
              handleRedirectToOrBack()
              logout();
            }}
            >Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer sx={{ backgroundColor:'#ffffff', width: DRAWER_WIDTH, flexShrink: 0,'& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', }, }} variant="permanent" anchor="left" >
        <List sx={{ mt: 9}}>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ width: 30, height: 30 }} src={currentUser?.photoURL}/>
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontWeight: 700}}>{currentUser?.displayName}</Typography>} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button component={NavLink} exact to="/projects" sx={{ "&:hover": { backgroundColor: '#ededff'}} }>
            <ListItemIcon>
              {
                location.pathname.startsWith('/projects') ?
                <FolderTwoToneIcon sx={{ color: '#6366f1' }}/>
                :
                <FolderOutlinedIcon sx={{ color: '#6366f1' }} />
              }
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontSize: 14, fontWeight: 700}}>Projects</Typography>} />
          </ListItem>
          <ListItem button component={NavLink} exact to="/explore" sx={{ "&:hover": { backgroundColor: '#ededff'},  }}>
            <ListItemIcon>
            {
              location.pathname.startsWith('/explore') ?
              <ExploreTwoToneIcon sx={{ color: '#6366f1' }}/>
              :
              <ExploreOutlinedIcon sx={{ color: '#6366f1' }} />
            }
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontSize: 14, fontWeight: 700}}>Explore</Typography>} />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </Box>
  )
      } else {
        return (
         <div></div>
        )
      }
}