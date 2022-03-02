import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

import Project from "../components/Project";

import { db } from "../utils/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

const ProjectsPage = () => {
  const { currentUser } = useAuth();

  const [projects, setProjects] = useState([
    {
      id: 1,
      owner: { id: "11111", displayName: "Sagi" },
      collaborators: [{ id: 10101010, displayName: "Sagi", photoURL: "" }],
      name: "Doctors Among The World",
      conversations: [{ id: 1, name: "USA", source: {} }],
      description:
        "Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi Sagi",
      createdAt: "2020-10-05T14:48:00.000Z",
      collaborators: [
        { id: 1, displayName: "Sagi", photoURL: "" },
        { id: 2, displayName: "Linoy", photoURL: "" },
      ],
    },
    {
      id: 2,
      owner: { id: "22222", displayName: "Yaron" },
      collaborators: [{ id: 10101010, displayName: "Sagi", photoURL: "" }],
      name: "DC111",
      conversations: [{ id: 1, name: "marvel", source: {} }],
      description: "Check",
      createdAt: "2020-10-05T14:48:00.000Z",
    },
    {
      id: 3,
      owner: { id: "33333", displayName: "Yarin" },
      collaborators: [{ id: 10101010, displayName: "Sagi", photoURL: "" }],
      name: "Marvel MCU11",
      conversations: [{ id: 1, name: "marvel", source: {} }],
      description: "Check",
      createdAt: "2020-10-05T14:48:00.000Z",
    },
  ]);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchInput, setSearchInput] = useState("");

  const [projectsOwnedByMe, setProjectsOwnedByMe] = useState([]);
  const [projectsCollaboratedWithMe, setCollaboratedWithMe] = useState([]);

  useEffect(() => {
    // Subscribe to query with onSnapshot
    const isOwnedByMe = query(
      collection(db, "Projects"),
      where("owner", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const isCollaboratedWithMe = query(
      collection(db, "Projects"),
      where("collaborators", "array-contains", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    onSnapshot(isOwnedByMe, (querySnapshot) => {
        // Get all documents from collection - with IDs
        const ownedByMeArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          shared: false,
        }));

        // Update state
        setProjectsOwnedByMe(ownedByMeArray);
      });
    onSnapshot(isCollaboratedWithMe, (querySnapshot) => {
      // Get all documents from collection - with IDs
      const collaboratedWithMeArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        shared: true,
      }));

      // const collaboratedWithMeArray = await Promise.all(querySnapshot.docs.map(async (doc) => {
      //   const { owner, ...data} = doc.data();


      //   return { 
      //     owner: { id: owner, displayName: currentUser.displayName },
      //     ...data,
      //     id: doc.id,
      //     shared: true,
      //   }
        
      // }));

      // Update state
      setCollaboratedWithMe(collaboratedWithMeArray);
    });
  }, []);

  useEffect(() => {
    const allProjects = projectsOwnedByMe.concat(projectsCollaboratedWithMe);
    allProjects.sort((a, b) => b.createdAt - a.createdAt)
    console.log(allProjects);
  }, [projectsOwnedByMe.length, projectsCollaboratedWithMe.length]);

  const handleSearch = (text) => {
    if (text) {
      let result = projects.filter((row) => {
        return row.name.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredProjects(result);
    } else {
      setFilteredProjects(projects);
    }
  };

  const eachProject = (item, index) => {
    return <Project key={item.id} index={index} project={item}></Project>;
  };

  return (
    <Layout>
      <Box sx={{ width: "69vw" }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <OutlinedInput
            sx={{ width: 500, height: 32 }}
            placeholder="Find a project..."
            value={searchInput}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearchInput(e.target.value);
            }}
          />
          <Button
            startIcon={<AddIcon />}
            component={Link}
            to="/new-project"
            variant="contained"
            sx={{
              backgroundColor: "#6366f1",
              "&:hover": { backgroundColor: "#4e50c6" },
              height: 32,
              textTransform: "none",
            }}
          >
            New
          </Button>
        </Stack>
        <Box sx={{ mt: 2 }}>{filteredProjects.map(eachProject)}</Box>
        <Divider light sx={{ mt: 3 }} />
      </Box>
    </Layout>
  );
};
export default ProjectsPage;
