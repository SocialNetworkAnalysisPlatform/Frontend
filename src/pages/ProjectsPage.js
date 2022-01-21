
import React, {useState} from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { NavLink } from 'react-router-dom'

import Project from '../components/Project'

const ProjectsPage = () => {
    const [projects, setProjects] = useState([
        {id: 1, owner: { id: '11111', name: "Sagi"}, shared: false, name: 'Doctors Among The World', conversations: [{ id: 1, name: "USA", source: {} }], description: "Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi ", createdAt: "2020-10-05T14:48:00.000Z"},
        {id: 2, owner: { id: '22222', name: "Yaron"}, shared: true, name: 'Marvel MCU', conversations: [{ id: 1, name: "marvel", source: {} }], description: "Check", createdAt: "2020-10-05T14:48:00.000Z"},
        {id: 3, owner: { id: '33333', name: "Yarin"}, shared: true, name: 'DC', conversations: [{ id: 1, name: "marvel", source: {} }], description: "Check", createdAt: "2020-10-05T14:48:00.000Z"}

    ]);
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (text) => {
        if (text) {
            let result = projects.filter((row) => {
            return row.name.toLowerCase().includes(text.toLowerCase());
            });
            setFilteredProjects(result);
        }
        else {
            setFilteredProjects(projects);
        }
    }

    const eachProject = (item, index) => {
        return  (<Project key={item.id} index={index} project={item}></Project>)
    };

  return (
    <Layout>
        <Box sx={{ width: '69vw' }}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <OutlinedInput sx={{ width: 500, height: 32 }} placeholder='Find a project...' value={searchInput} onChange={(e) => {handleSearch(e.target.value); setSearchInput(e.target.value)} }/> 
                <Button startIcon={<AddIcon />} component={NavLink} to="/newproject" variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, height: 32, textTransform: "none",}} >
                    New
                </Button>
            </Stack>
            <Box sx={{mt: 2, }}>
            { filteredProjects.map(eachProject) }
            </Box>
            <Divider light sx={{ mt: 3 }} />
        </Box>
    </Layout>
  )
}
export default ProjectsPage;
