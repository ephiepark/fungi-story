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
import { selectUniverseEditorFetchError, selectUniverseEditorFetchStatus, fetchUniverseInfoAsync, createUniverseAsync, updateUniverseAsync, selectUniverseEditorUpdateStatus, selectUniverseEditorUpdateError } from './universeEditorSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { routeConfig } from '../../../configs/routeConfig';

const theme = createTheme();

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UniverseEditor() {
  const query = useQuery();
  const universeId = query.get('universeId');
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const fetchError = useAppSelector(selectUniverseEditorFetchError);
  const fetchStatus = useAppSelector(selectUniverseEditorFetchStatus);
  const updateError = useAppSelector(selectUniverseEditorUpdateError);
  const updateStatus = useAppSelector(selectUniverseEditorUpdateStatus);

  useEffect(() => {
    if (universeId !== null) {
      dispatch(fetchUniverseInfoAsync(universeId));
    }
  }, [universeId]);

  if (user !== null && !user.isVerified) {
    return <Redirect to={'/' + routeConfig.emailVerificationRoute} />;
  }
  if (user === null) {
    return <Redirect to={'/'} />;
  }

  let alert = null;
  if (fetchError !== null) {
    alert = <Alert severity="error">{fetchError.errorMessage}</Alert>;
  } else if (updateError !== null) {
    alert = <Alert severity="error">{updateError.errorMessage}</Alert>;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const universeName = data.get('universeName')?.toString() || '';
    if (universeId === null) {
      dispatch(createUniverseAsync({userId: user!.id, universeData: {universe_name: universeName}}));
    } else {
      dispatch(updateUniverseAsync({universeId: universeId, userId: user!.id, universeData: {universe_name: universeName}}));
    }
  };

  const buttonContent = universeId === null ? 'Create' : 'Update';
  const buttonConfig = {
    disabled: updateStatus === 'pending',
    content: updateStatus === 'pending' ? <div>{buttonContent}<CircularProgress size={10}/></div> : buttonContent,
  };

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
            Universe Editor
          </Typography>
          {alert}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="Universe name"
                  name="universeName"
                  required
                  fullWidth
                  id="universeName"
                  label="Universe Name"
                  autoFocus
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={buttonConfig.disabled}
            >
              {buttonConfig.content}
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
