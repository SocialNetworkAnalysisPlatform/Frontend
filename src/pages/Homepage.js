
import React, { useState, useEffect } from 'react'
import parse from 'html-react-parser';
import { Link, useLocation } from 'react-router-dom'
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
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Homepage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const particlesInit = async (main) => {
    await loadFull(main);
  };


  return (
    <Box sx={{ backgroundColor: 'white'}}>
      <Stack direction="row" spacing={5}>
          <Stack justifyContent={"center"} alignItems={"center"} sx={{ width: 800, height: '100vh', backgroundColor: 'white', }}>
            <Box sx={{ backgroundImage: `url(${Logo})`,backgroundSize: 'contain', backgroundRepeat:'no-repeat', width: '200px', height: '90px'}}/>
            <Typography sx={{ mb: 3, textAlign: 'center', width: '70%', fontSize: "18px", fontWeight: 600, color: "#6366f1" }}>
              Find out what your WhatsApp group conversations are about! 
            </Typography>
            <Typography sx={{ mb: 3, fontSize: "14px", fontWeight: 400, color: "#979797" }}>
              Sign in to your account to continue
            </Typography>
            <Login/>
            <Divider sx={{mt: 10, width: 230}} />
            <Typography sx={{ mt: 3, mb: 1, fontSize: "14px", fontWeight: 400, color: "#979797" }}>
              Developed by <a href="https://www.linkedin.com/in/sagi-chubok/" target="_blank" style={{color: '#6366f1', fontWeight: 600, textDecoration: 'none'}}>Sagi Chubok</a>
              &nbsp;&&nbsp;
              <a href="https://www.linkedin.com/in/linoy-chubok/" target="_blank" style={{color: '#6366f1', fontWeight: 600, textDecoration: 'none'}}>Linoy Chubok</a>
            </Typography>
            {/* <Box>
              <Typography sx={{ mt: 3, mb: 1, fontSize: "14px", fontWeight: 400, color: "#979797" }}>
                Find us on social media!
              </Typography>
              <Stack direction={"row"} spacing={3}>
                <Fab size="small" sx={{ backgroundImage: `url(${Linkedin})`,backgroundPosition: 'center', backgroundSize: 22, backgroundRepeat:'no-repeat', backgroundColor: 'white'}}></Fab>
                <Fab size="small" sx={{ backgroundImage: `url(${Facebook})`,backgroundPosition: 'center', backgroundSize: 22, backgroundRepeat:'no-repeat', backgroundColor: 'white'}}></Fab>
                <Fab size="small" sx={{ backgroundImage: `url(${Instagram})`,backgroundPosition: 'center', backgroundSize: 22, backgroundRepeat:'no-repeat', backgroundColor: 'white'}}></Fab>
              </Stack>
            </Box> */}
          </Stack>

          <Box sx={{ width: "100%" }}>
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                fullScreen: {
                  enable: false,
                  zIndex: 0
                },
                background: {
                  color: {
                    value: "#6366f1",
                  },
                },
                fpsLimit: 120,
                interactivity: {
                  events: {
                    onClick: {
                      enable: true,
                      mode: "push",
                    },
                    onHover: {
                      enable: true,
                      mode: "repulse",
                    },
                    resize: true,
                  },
                  modes: {
                    push: {
                      quantity: 4,
                    },
                    repulse: {
                      distance: 200,
                      duration: 0.4,
                    },
                  },
                },
                particles: {
                  color: {
                    value: "#ffffff",
                  },
                  links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                  },
                  collisions: {
                    enable: true,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                      default: "bounce",
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800,
                    },
                    value: 80,
                  },
                  opacity: {
                    value: 0.5,
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    value: { min: 1, max: 5 },
                  },
                },
                detectRetina: true,
              }}
            />
          </Box>
      </Stack>
    </Box>
  )
}
export default Homepage;
