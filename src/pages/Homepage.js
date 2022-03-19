
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import Login from '../components/Login'

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Bg from '../assets/images/bg.jpg';
import Logo from '../assets/images/snap-logo.png';

const Homepage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <Box sx={{ backgroundColor: 'white'}}>
      <Stack direction="row" spacing={5}>
        <Box sx={{ width: 385, height: '100vh', backgroundColor: 'white', }}>
          <Box sx={{mt: "20px", mb: "50px", ml: "40px"}}>
            <Box sx={{ml: 3, backgroundImage: `url(${Logo})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: '220px', height: '100px'}}/>
            <Login/>
          </Box>
        </Box>

        <Box sx={{ width: "100%", backgroundImage: `url(${Bg})` }}>
          <Box sx={{}}>
          </Box>
        </Box>
      </Stack>

    </Box>
  )
}
export default Homepage;
