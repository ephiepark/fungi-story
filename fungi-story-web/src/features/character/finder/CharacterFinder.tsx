import { Alert, Box, Container, CssBaseline, Icon, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, Redirect, useHistory } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { Copyright } from '../../../components/Copyright';
import { selectUser } from '../../user/userSlice';
import { fetchCharacterInfoListForUniverseAsync, selectCharacterFinderError, selectCharacterFinderStatus, selectCharacterFinderCharacterInfoList } from './characterFinderSlice';
import { routeConfig } from '../../../configs/routeConfig';
import { useEffect } from 'react';


const theme = createTheme();

export default function CharacterFinder(props: {universeId: string}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const error = useAppSelector(selectCharacterFinderError);
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectCharacterFinderStatus);
  const characterInfoList = useAppSelector(selectCharacterFinderCharacterInfoList);

  useEffect(() => {
    if (user !== null) {
      dispatch(fetchCharacterInfoListForUniverseAsync(props.universeId));
    }
  }, [props.universeId]);

  if (user !== null && !user!.isVerified) {
    return <Redirect to={'/' + routeConfig.emailVerificationRoute} />;
  }
  if (user === null) {
    return <Redirect to={'/'} />;
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
          <IconButton component={RouterLink} to={`/${routeConfig.universeEditorRoute}/create`}><Icon color="primary">add_circle</Icon></IconButton>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Character Name</TableCell>
                  <TableCell align="right">Summary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {characterInfoList.map((characterInfo) => {
                  console.log(characterInfo);
                  return (<TableRow
                    key={characterInfo.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link component={RouterLink} to={`/${routeConfig.universeViewerRoute}/${props.universeId}/${routeConfig.characterViewerRoute}/${characterInfo.id}`}>{characterInfo.characterData.characterName}</Link>
                    </TableCell>
                    <TableCell align="right">{characterInfo.characterData.characterSummary}</TableCell>
                  </TableRow>);
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
