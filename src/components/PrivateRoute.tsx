import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../context/Auth';
import Constants from '../assets/utils/Constants';

type PrivateRouteProps = {
  exact?: boolean;
  path: string;
  render?: (...args: any[]) => any;
};

const PrivateRoute: FC<PrivateRouteProps> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        AuthContext.isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `/${Constants.LOGIN_PATH}`,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
