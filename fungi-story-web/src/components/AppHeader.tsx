import { RouteConfig } from "../configs/routeConfig";
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/user/userSlice';
import { authApi } from '../firebase/firebaseInit';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { Link as RouterLink } from 'react-router-dom';

function LoggedInNav(props: { routeConfig: RouteConfig }) {
  return (
    <nav>
      <Link
        variant="button"
        color="text.primary"
        sx={{ my: 1, mx: 1.5 }}
        component={RouterLink}
        to={"/"}
        onClick={authApi.genSignOut}
      >
        Sign Out
      </Link>
    </nav>
  );
}

function LoggedOutNav(props: { routeConfig: RouteConfig }) {
  return (
    <nav>
      <Link
        variant="button"
        color="text.primary"
        sx={{ my: 1, mx: 1.5 }}
        component={RouterLink}
        to={"/" + props.routeConfig.signInRoute}
      >
        Sign In
      </Link>
      <Link
        variant="button"
        color="text.primary"
        sx={{ my: 1, mx: 1.5 }}
        component={RouterLink}
        to={"/" + props.routeConfig.signUpRoute}
      >
        Sign Up
      </Link>
    </nav>
  );
}

export default function AppHeader(props: { routeConfig: RouteConfig }) {
  const user = useAppSelector(selectUser);
  let nav = <LoggedInNav routeConfig={props.routeConfig} />;
  if (user === null) {
    nav = <LoggedOutNav routeConfig={props.routeConfig} />;
  }
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link component={RouterLink} to="/">Fungi</Link>
        </Typography>
        {nav}
      </Toolbar>
    </AppBar>
  );
};
