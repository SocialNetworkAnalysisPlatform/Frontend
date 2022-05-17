import React, { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

const SkeletonExploreCard = () => {
    return(
        <Card sx={{ width: '28%', mr: 5, mb: 5 }}>
            <CardContent sx={{ height: 150}}>
                <Skeleton variant="text" height={30} width={'70%'} />
                <Stack spacing={1} mt={2}>
                    <Skeleton variant="text" height={10} />
                    <Skeleton variant="text" height={10} />
                    <Skeleton variant="text" height={10} />
                    <Skeleton variant="text" height={10} width={'70%'}/>
                </Stack>
            </CardContent>
            <CardActions>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" height={14} width={50}/>
            </CardActions>
        </Card>
    );
};
export default SkeletonExploreCard;
