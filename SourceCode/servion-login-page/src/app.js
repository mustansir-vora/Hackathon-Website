import React from 'react';
import './styles/global.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import NewLogin from './components/NewLogin';
import CreateSurvey from './components/CreateSurvey';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <NewLogin />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <PrivateRoute exact path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute exact path="/create-survey">
          <CreateSurvey />
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;