
import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

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

const ExplorePage = () => {

  const [cards, setCards] = useState([
    { id: 1, title: 'Project', description: 'description', img: '', views: 123  },
    { id: 2, title: 'Project', description: 'description', img: '', views: 123  },
    { id: 3, title: 'Project', description: 'description', img: '', views: 123  },
    { id: 4, title: 'Project', description: 'description', img: '', views: 123  },
    { id: 5, title: 'Project', description: 'description', img: '', views: 123  },
    { id: 6, title: 'Project', description: 'description', img: '', views: 123  },
  ]);

  const [loading, setLoading] = useState(true);

    // Scroll to top on page load
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

    
  return (
    <Layout>
      <Typography sx={{ fontSize: 24, fontWeight: 500, color: "#6366f1" }}>Explore</Typography>
      <Typography variant="body2" color="text.secondary">Explore Visualizations Published by the Community</Typography>
      <Stack sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start', mt: 3 }}>
        {
          loading === false ?
          cards.map((card, index) => {
            return (
              <Card key={card.id} index={index} sx={{ width: '28%', mr: 5, mb: 5 }}>
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
                  <Typography sx={{ ml: 1 }} variant="body2" color="text.secondary">121</Typography>
                </CardActions>
            </Card>
          )
          })
          :
          [1,2,3,4,5,6].map((num) => <SkeletonExploreCard/>)
        }
      </Stack>
    </Layout>
  )
}
export default ExplorePage;
