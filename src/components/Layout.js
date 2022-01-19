import React from 'react'
import Box from '@mui/material/Box';
import { Navbar } from './Navbar'
import { useAuth } from '../contexts/AuthContext'

export const Layout = ({ children }) => {
  const { currentUser } = useAuth()

  return (
    <Box sx={{ backgroundColor: '#f2f4f7'}}>
      <Navbar />
      <Box ml={35} mt={4}>{children}</Box>
    </Box>
  )
}
