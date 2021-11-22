import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../user/userSlice';
import { RouteConfig } from "../../../configs/routeConfig";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Copyright } from '../../../components/Copyright';

import { Link as RouterLink, Redirect, useLocation, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { routeConfig } from '../../../configs/routeConfig';
import { fetchUniverseInfoAsync, resetState, selectUniverseViewerFetchError, selectUniverseViewerFetchStatus, selectUniverseViewerUniverseInfo } from './universeViewerSlice';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';

import CharacterFinder from '../../character/finder/CharacterFinder';

const drawerWidth = 240;

export default function UniverseViewer() {
  const { universeId } = useParams<{universeId: string}>();
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const universeInfo = useAppSelector(selectUniverseViewerUniverseInfo);
  const fetchError = useAppSelector(selectUniverseViewerFetchError);
  const fetchStatus = useAppSelector(selectUniverseViewerFetchStatus);

  useEffect(() => {
    dispatch(fetchUniverseInfoAsync(universeId));
  }, [universeId]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, []);

  if (user !== null && !user!.isVerified) {
    return <Redirect to={'/' + routeConfig.emailVerificationRoute} />;
  }
  if (user === null) {
    return <Redirect to={'/'} />;
  }

  if (fetchStatus === 'pending') {
    return <div>loading</div>;
  }

  let alert = null;
  if (fetchError !== null) {
    alert = <Alert severity="error">{fetchError.errorMessage}</Alert>;
  }

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   const universeName = data.get('universeName')?.toString() || '';
  //   if (universeId === null) {
  //     dispatch(createUniverseAsync({userId: user!.id, universeData: {universe_name: universeName}}));
  //   } else {
  //     dispatch(updateUniverseAsync({universeId: universeId, userId: user!.id, universeData: {universe_name: universeName}}));
  //   }
  // };

  // const buttonContent = universeId === null ? 'Create' : 'Update';
  // const buttonConfig = {
  //   disabled: updateStatus === 'pending',
  //   content: updateStatus === 'pending' ? <div>{buttonContent}<CircularProgress size={10}/></div> : buttonContent,
  // };
  return (
    <Container component="main" maxWidth="xs" sx={{zIndex: (theme) => theme.zIndex.drawer}}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
            zIndex: (theme) => {
              console.log('drawer zIndex', theme.zIndex.drawer);
              // return theme.zIndex.drawer;
              return 0;
            }
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {['Character', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <LockOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <LockOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <CharacterFinder universeId={universeId} />
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Universe Viewer
          </Typography>
          {alert}
          <Box sx={{ mt: 3 }}>
            <div>{universeInfo?.universe_data.universe_name}</div>
          </Box> */}
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
