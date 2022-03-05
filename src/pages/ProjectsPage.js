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

import Service from '../utils/service'

const service = Service.getInstance();

const ProjectsPage = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectsOwnedByMe, setProjectsOwnedByMe] = useState([]);
  const [projectsCollaboratedWithMe, setCollaboratedWithMe] = useState([]);

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchInput, setSearchInput] = useState("");


  useEffect(() => {
    let isMounted = true;               // note mutable flag

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

    onSnapshot(isOwnedByMe, async (querySnapshot) => {
        const ownedByMeArray = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const { owner, createdAt, ...data } = doc.data();
          const user = await service.readUserData(owner);
          return {
            owner: { id: owner, displayName: user ? user.displayName : "User", photoUrl: user ? user.photoUrl : "" },
            ...data,
            id: doc.id,
            collaborated: false,
            createdAt: createdAt.toDate(),
          }
        }));

        // Update state
        if (isMounted) {
        setProjectsOwnedByMe(ownedByMeArray);
        }
      });

    onSnapshot(isCollaboratedWithMe, async(querySnapshot) => {
      const collaboratedWithMeArray = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const { owner, createdAt, ...data } = doc.data();
        const user = await service.readUserData(owner);
        return {
          owner: { id: owner, displayName: user ? user.displayName : "User", photoUrl: user ? user.photoUrl : "" },
          ...data,
          id: doc.id,
          collaborated: true,
          createdAt: createdAt.toDate(),
        }
      }));

      // Update state
      if (isMounted) {
      setCollaboratedWithMe(collaboratedWithMeArray);
      }
    });

    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    const allProjects = projectsOwnedByMe.concat(projectsCollaboratedWithMe);
    allProjects.sort((a, b) => b.createdAt - a.createdAt)
    setProjects(allProjects);
    setFilteredProjects(allProjects);
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
