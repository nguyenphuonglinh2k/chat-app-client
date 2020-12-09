import React from 'react';

import SignUp from '../components/signUp/SignUp';
import SignIn from '../components/signIn/SignIn';
import Chat from '../components/chat/Chat';
import ResetPassword from '../components/reset-password/ResetPassword';
import ForgotPassword from '../components/reset-password/ForgotPassword';

import {
    BrowserRouter as Router,
    Route, 
    Redirect
  } from "react-router-dom";

function AccountRoute() {
  return (
    <Router>
      <Route path="/" exact>
        <Redirect to="/chat" />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Route path="/signin" exact>
        <SignIn />
      </Route>
      <Route path="/forgot-password" exact>
        <ForgotPassword />
      </Route>
      <Route path="/reset-password/:userId" exact>
        <ResetPassword />
      </Route>
      <Route path="/chat" exact>
        <Chat />
      </Route>
    </Router>
  );
}

export default AccountRoute;
