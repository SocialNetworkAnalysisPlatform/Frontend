
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import Login from '../components/Login'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import Bg from '../assets/images/bg.jpg';
import Logo from '../assets/images/snap-logo.png';
import Facebook from '../assets/icons/facebook-icon.png';
import Linkedin from '../assets/icons/linkedin-icon.png';
import Instagram from '../assets/icons/instagram-icon.png';

const Homepage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <Box sx={{ backgroundColor: 'white'}}>
      <Stack direction="row" spacing={5}>
          <Stack justifyContent={"center"} alignItems={"center"} sx={{ width: 800, height: '100vh', backgroundColor: 'white', }}>
            <Box sx={{ backgroundImage: `url(${Logo})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: '200px', height: '90px'}}/>
            <Typography sx={{ mb: 3, fontSize: "14px", fontWeight: 400, color: "#979797" }}>
              Sign in to your account to continue
            </Typography>
            <Login/>
            <Divider sx={{mt: 10, width: 230}} />
            <Typography sx={{ mt: 3, mb: 1, fontSize: "14px", fontWeight: 400, color: "#979797" }}>
              Find us on social media!
            </Typography>
            <Stack direction={"row"} spacing={3}>
              <Fab size="small" sx={{ backgroundImage: `url(${Linkedin})`,backgroundPosition: 'center', backgroundSize: 22, backgroundRepeat:'no-repeat', backgroundColor: 'white'}}></Fab>
              <Fab size="small" sx={{ backgroundImage: `url(${Facebook})`,backgroundPosition: 'center', backgroundSize: 22, backgroundRepeat:'no-repeat', backgroundColor: 'white'}}></Fab>
              <Fab size="small" sx={{ backgroundImage: `url(${Instagram})`,backgroundPosition: 'center', backgroundSize: 22, backgroundRepeat:'no-repeat', backgroundColor: 'white'}}></Fab>
            </Stack>
          </Stack>

        <Box sx={{ width: "100%", backgroundImage: `url(${Bg})` }}>
          <Box sx={{}}>
          </Box>
        </Box>
      </Stack>

    </Box>
  )
}
export default Homepage;
