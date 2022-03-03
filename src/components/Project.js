
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import dateFormat, { masks } from "dateformat";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';

const Project = (props) => {
    const { currentUser } = useAuth()
    // Graph
    const data = [
        { month: "Jan", value: 200},
        { month: "Feb", value: 500},
        { month: "Mar", value: 212},
        { month: "Apr", value: 900},
        { month: "May", value: 300},
        { month: "Jun", value: 543},
        { month: "Jul", value: 1000},
        { month: "Aug", value: 99},
        { month: "Sept", value: 894},
        { month: "Oct", value: 0},
        { month: "Nov", value: 542},
        { month: "Dec", value: 123},
      ]
      const args = {
        chartData: data,
        gradientColor: "#6366f1",
        uniqueId: 1,
      }
      //
    
    return (
        <Box sx={{ mt: 3 }}>
            <Divider light sx={{ mb: 3 }}/>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography component={Link} to={`/project/${props.project.id}`} sx={{ textDecoration: "none", color: "#000000DE" , fontSize: 20, fontWeight: 500, "&:hover": { color: "#6366f1" }}}>{props.project.name}</Typography>
                <SettingsIcon sx={{ color: 'rgba(0, 0, 0, 0.6)', "&:hover": { color: "#6366f1" }}}/>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    { props.project.collaborated && 
                        <Typography color="textSecondary" sx={{ fontSize: 12, }}>{`Shared from ${props.project.owner.displayName}/${props.project.name}`}</Typography>
                    }
                    <Typography color="textSecondary" sx={{ fontSize: 14, width: '32vw', wordWrap: 'break-word' }}>{props.project.description.length > 170 ? `${props.project.description.substring(0, 170)}...` : props.project.description }</Typography>
                    <Stack direction={"row"} sx={{ mt: 1 }}>
                        <ChatIcon sx={{ mt: 0.4, fontSize: 12, }}/>
                        <Typography color="textSecondary" gutterBottom sx={{ ml: 1 , fontSize: 12, }}>{props.project.conversations ? props.project.conversations.length : '0'}</Typography>
                        <Typography color="textSecondary" sx={{ ml: 3 , fontSize: 12, }}>{`Created at ${dateFormat(new Date(props.project.createdAt), "dd/mm/yyyy")}`}</Typography>
                    </Stack>
                </Box>
                <ResponsiveContainer width={"20%"} height={50}>
                    <AreaChart data={args.chartData}
                        margin={{ top: 20, right: 10, left: -30, bottom: 0 }}>
                        <defs>
                        <linearGradient id={"colorUv" + args.uniqueId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="100%" stopColor={args.gradientColor} />
                        </linearGradient>
                        </defs>
                        {/* <XAxis dataKey="month" />
                        <YAxis 
                        width={80}
                        interval={0}
                        /> */}
                        <Area type="monotone" dataKey="value" stroke={args.gradientColor} fillOpacity={0.1} fill={"url(#colorUv" + args.uniqueId + ")"} />
                    </AreaChart>
                </ResponsiveContainer>
            </Stack>
        </Box>
    )
}
export default Project;