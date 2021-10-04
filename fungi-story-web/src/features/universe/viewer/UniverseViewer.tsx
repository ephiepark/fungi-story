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

const theme = createTheme();

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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Universe Viewer
          </Typography>
          {alert}
          <Box sx={{ mt: 3 }}>
            <div>{universeInfo?.universe_data.universe_name}</div>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
