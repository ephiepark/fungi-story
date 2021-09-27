import { Alert, Box, Container, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { Copyright } from '../../../components/Copyright';
import { selectUser } from '../../user/userSlice';
import { fetchUniverseInfoListForUserAsync, selectUniverseFinderError, selectUniverseFinderStatus, selectUniverseFinderUniverseInfoList } from './universeFinderSlice';
import { routeConfig } from '../../../configs/routeConfig';
import { useEffect } from 'react';

const theme = createTheme();

export default function UniverseFinder() {
  const dispatch = useDispatch();
  const error = useAppSelector(selectUniverseFinderError);
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectUniverseFinderStatus);
  const universeInfoList = useAppSelector(selectUniverseFinderUniverseInfoList);

  useEffect(() => {
    if (user !== null) {
      dispatch(fetchUniverseInfoListForUserAsync(user.userInfo));
    }
  }, [user?.id]);


  if (user !== null && !user.isVerified) {
    return <Redirect to={'/' + routeConfig.emailVerificationRoute} />;
  }

  const alertMessage = error === null ? '' : error?.errorMessage ?? '';
  const alert = (status === 'rejected') ? <Alert severity={'error'}>{alertMessage}</Alert> : null;

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
          {alert}
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Universe Name</TableCell>
                  <TableCell align="right">Creator</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {universeInfoList.map((universeInfo) => (
                  <TableRow
                    key={universeInfo.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {universeInfo.universe_name}
                    </TableCell>
                    <TableCell align="right">{universeInfo.creator_user_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
