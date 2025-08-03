import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isTokenValid = userData?.token && userData?.tokenExpiration > Date.now();
  
  if (!isTokenValid && userData) {
    localStorage.removeItem('userData');
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isTokenValid ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
