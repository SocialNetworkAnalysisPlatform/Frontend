import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import Navlink from './Navlink'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';

import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Logo from '../assets/images/snap-logo.png';

const drawerWidth = 240;

export const Navbar = () => {
  const { logout, currentUser } = useAuth()

  return (
    <>
    <Box>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1 , backgroundColor:'#ffffff',  boxShadow: '0 2px 15px 0 rgb(0 0 0 / 5%)' }}>
        <Toolbar sx={{justifyContent: "space-between" }}>
          <Stack>
            <Box sx={{ml: -1.4, backgroundImage: `url(${Logo})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: '140px', height: '55px'}}/>
          </Stack>
          <Stack direction="row" spacing={4}>
            <Button component={NavLink} to="/" variant="outlined" sx={{ color: '#6366f1', borderColor: '#6366f1', "&:hover": { backgroundColor: '#ededff', borderColor: '#6366f1' }, textTransform: 'none'}}
            onClick={ e => {
              e.preventDefault()
              logout();
            }}
            >Logout</Button>
          </Stack>
          </Toolbar>
      </AppBar>
      <Drawer sx={{ backgroundColor:'#ffffff', width: drawerWidth, flexShrink: 0,'& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="permanent" anchor="left" >
        <Divider />

        <List sx={{ mt: 10}}>
          <ListItem>
            <ListItemIcon>
                <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL}/>
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontWeight: 700}}>{currentUser.displayName}</Typography>} />
          </ListItem>
        </List>
        <Divider />

        <List>
          <ListItem button component={NavLink} to="/explore" sx={{ "&:hover": { backgroundColor: '#ededff'} }}>
            <ListItemIcon>
              <ExploreOutlinedIcon sx={{ color: '#6366f1', }}/>
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontSize: 14, fontWeight: 700}}>Explore</Typography>} />
          </ListItem>

          <ListItem button component={NavLink} to="/projects" sx={{ "&:hover": { backgroundColor: '#ededff'}} }>
            <ListItemIcon>
              <FolderOutlinedIcon sx={{ color: '#6366f1' }} />
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontSize: 14, fontWeight: 700}}>Projects</Typography>} />
          </ListItem>

        </List>
        <Divider />

        <List>
        <ListItem sx={{fontFamily: 'Roboto', fontSize:14, fontWeight: 700}}>Latest Projects</ListItem>
          {['Marvel MCU', 'DC', 'Doctors in USA'].map((text, index) => (
            <ListItem button key={text} sx={{height: 30, "&:hover": { background: 'none', color: '#6366f1' },}}>
                <ListItemText primary={<Typography sx={{fontFamily: 'Roboto', fontSize: 14}}>{text}</Typography>} />
            </ListItem>
          ))}
        </List>
        {/* <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
        <Toolbar />
    </Box>
    {/* <Box sx={{ p: 3, backgroundColor: 'rgba(255,255,255,.99)', boxShadow: '0px 0px 24px 0px rgb(0 0 0 / 15%)', }}  >
      <Stack justifyContent='flex-start' spacing={4} direction="row">
        <Navlink to='/' name='Firbase Authentication' size='lg' />
        {!currentUser && <Button variant="outlined" color="inherit" component={NavLink} to="/login">Login</Button> }
        {!currentUser && <Button variant="outlined" color="inherit" component={NavLink} to="/register">Register</Button> }
        {currentUser && <Button variant="outlined" color="inherit" component={NavLink} to="/profile">Profile</Button> }
        {currentUser && <Button variant="outlined" color="inherit" component={NavLink} to="/logout"
         onClick={async e => {
          e.preventDefault()
          logout();
        }}
        >Logout</Button>}
      </Stack>
    </Box> */}
    </>
  )
}