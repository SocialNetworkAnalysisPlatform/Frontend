import React, { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';

const SkeletonTableRow = () => {
    return(
        <TableRow>
            <TableCell padding="checkbox" >
                <Skeleton variant="rectangular" width={18} height={18} sx={{ ml: 1.5 }}/>
            </TableCell>
            <TableCell align={'left'}>
                <Skeleton variant="text" width={100}/>
            </TableCell>
            <TableCell align={'left'}>
                <Skeleton variant="text" width={100}/>
            </TableCell>
            <TableCell align={'left'}>
               <Skeleton variant="text" width={100}/>
            </TableCell>
            <TableCell align={'left'}>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                    <Skeleton variant="circular" width={25} height={25} />
                    <Skeleton variant="text" width={100}/>
                </Stack>
            </TableCell>
            <TableCell align={'left'}>
                <Skeleton variant="text" width={100}/>
            </TableCell>
            <TableCell align={'center'}> 
                <Skeleton variant="circular" width={25} height={25} sx={{ ml: 1.5 }}/>
            </TableCell>
    </TableRow>
    );
};
export default SkeletonTableRow;
