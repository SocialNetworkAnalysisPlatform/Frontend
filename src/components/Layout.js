import React from 'react'
import Box from '@mui/material/Box';
import { Navbar } from './Navbar'
import { useAuth } from '../contexts/AuthContext'

export const Layout = ({ children }) => {
  const { currentUser } = useAuth()

  return (
    <Box sx={{ height: '100vh'}}>
      <Navbar />
      <Box ml={35} mr={3} mt={4} mb={4}>{children}</Box>
    </Box>
  )
}
