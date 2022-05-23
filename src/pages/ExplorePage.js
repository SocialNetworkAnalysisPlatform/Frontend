
import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import SkeletonExploreCard from '../skeletons/SkeletonExploreCard'

import { db } from "../utils/firebase";
import { doc, collection, query, where, onSnapshot, setDoc, increment} from "firebase/firestore";

import Service from '../utils/service'

const service = Service.getInstance();

const ExplorePage = () => {

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const q = query(collection(db, "Conversations"), where("isPublished", "==", true));
    const unsub = onSnapshot(q, async (querySnapshot) => {
    
      const conversationsData = [];

      if(querySnapshot?.size > 0) {
        await Promise.all(
          querySnapshot.docs.map(async(docSnap) => {

            const docData = docSnap.data();
      
            const { creator, createdAt, ...data } = docData;
            const creatorData = await service.readUserData(creator);
          
            const shortestPath = await service.getNetworkShortestPath(docSnap.ref.path);
            
            conversationsData.push({ 
              id: docSnap.id,
              creator: { id: creator, displayName: creatorData.displayName, photoUrl: creatorData.photoUrl },
              createdAt: createdAt.toDate(),
              shortestPath,
              views: 0,
              ...data,
            });
          }));
        setCards(conversationsData);
      }
      setLoading(false);

    });

    return () => {
      unsub();
    };
  }, []);


    // Scroll to top on page load
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

    
    const handleClick = async(networkId) => {
      const docRef = await setDoc(doc(db, "Conversations", networkId), {
          views: increment(1),
        }, {
          merge: true
        });
  }

  return (
    <Layout>
      <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Explore</Typography>
      <Typography variant="body2" color="text.secondary">Explore Visualizations Published by the Community</Typography>
      <Stack sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start', mt: 3 }}>
        {
          loading === false ?
          cards.map((card, index) => {
            return (
              <Card key={card.id} index={index} sx={{ width: '28%', mr: 5, mb: 5, textDecoration: 'none', "&:hover": { boxShadow: '0 0px 2px 0 #d4d4ff, 0 0px 12px 0 #d4d4ff' }, }}
              onClick={function(){handleClick(card.id)}} component={Link} to={{ pathname: `/explore/${card.id}`, state: { network: card } }}>
                <CardContent sx={{ height: 150}}>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <VisibilityTwoToneIcon sx={{ color: '#6366f1'}}  />
                  <Typography sx={{ ml: 1 }} variant="body2" color="text.secondary">{card.views}</Typography>
                </CardActions>
            </Card>
          )
          })
          :
          [1,2,3,4,5,6].map((num, i) => <SkeletonExploreCard key={i}/>)
        }
      </Stack>
    </Layout>
  )
}
export default ExplorePage;
