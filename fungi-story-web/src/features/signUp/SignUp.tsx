import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../user/userSlice';
import { RouteConfig } from "../../configs/routeConfig";

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

import { Copyright } from '../../components/Copyright';

import { Link as RouterLink, Redirect } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { selectSignUpError, selectSignUpStatus, signUpAsync } from './signUpSlice';
import CircularProgress from '@mui/material/CircularProgress';

const theme = createTheme();

export default function SignUp(props: { routeConfig: RouteConfig }) {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const error = useAppSelector(selectSignUpError);
  const status = useAppSelector(selectSignUpStatus);
  if (user !== null) {
    return <Redirect to="/" />;
  }

  const alert = error !== null ? <Alert severity="error">{error.errorMessage}</Alert> : null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString() || '';
    const password = data.get('password')?.toString() || '';
    const penName = data.get('penName')?.toString() || '';
    dispatch(signUpAsync({email: email, password: password, penName: penName}));
  };

  const buttonConfig = {
    disabled: status === 'processing',
    content: status === 'processing' ? <div>{'Signing Up'}<CircularProgress size={10}/></div> : 'Sign Up',
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
            Sign up
          </Typography>
          {alert}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="Pen name"
                  name="penName"
                  required
                  fullWidth
                  id="penName"
                  label="Pen Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" component={RouterLink} to={"/" + props.routeConfig.signInRoute}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
