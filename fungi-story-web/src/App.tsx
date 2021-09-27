import {} from "./firebase/firebaseInit";

import AppHeader from "./components/AppHeader";
import SignIn from "./features/signIn/SignIn";
import SignUp from "./features/signUp/SignUp";
import ResetPassword from "./features/resetPassword/ResetPassword";
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/user/userSlice';
import { routeConfig } from './configs/routeConfig';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import EmailVerification from "./features/emailVerification/EmailVerification";

import { changes, patch } from './lib/diffApis';
import UniverseFinder from "./features/universe/finder/UniverseFinder";

console.log(changes, patch);

function App() {
  const user = useAppSelector(selectUser);
  const text = user === null ? 'Logged out' : 'Logged in as ' + user.userInfo.email;
  const isVerified = user?.isVerified;
  const isVerificationNecessary = (user !== null && !isVerified);
  return (
    <Router>
      <AppHeader routeConfig={routeConfig} />
      <Switch>
        <Route path={'/' + routeConfig.signInRoute}>
          <SignIn routeConfig={routeConfig} />
        </Route>
        <Route path={'/' + routeConfig.signUpRoute}>
          <SignUp routeConfig={routeConfig} />
        </Route>
        <Route path={'/' + routeConfig.resetPasswordRoute}>
          <ResetPassword routeConfig={routeConfig} />
        </Route>
        <Route path={'/' + routeConfig.emailVerificationRoute}>
          <EmailVerification />
        </Route>
        <Route path={'/' + routeConfig.universeFinderRoute}>
          <UniverseFinder />
        </Route>
        <Route path="/">
          {isVerificationNecessary ? <Redirect to={'/' + routeConfig.emailVerificationRoute} /> : <Redirect to={'/' + routeConfig.universeFinderRoute} />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
