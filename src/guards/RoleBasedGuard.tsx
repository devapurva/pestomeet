import { ReactNode } from 'react';
import { Container, Alert, AlertTitle } from '@material-ui/core';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  accessibleRoles: String[];
  children: ReactNode | string;
};

const useCurrentRole = () => {
  // Logic here to get current user role
  // const role = 'admin';
  const { user } = useAuth();
  return user?.role;
};

export default function RoleBasedGuard({ accessibleRoles, children }: RoleBasedGuardProp) {
  const currentRole = useCurrentRole();

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
