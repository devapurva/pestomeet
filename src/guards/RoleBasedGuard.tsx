import { ReactNode } from 'react';
import { Container } from '@material-ui/core';
import useAuth from '../hooks/useAuth';
import PermissionsDenied from '../pages/PermissionsDenied';

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
        <PermissionsDenied />
      </Container>
    );
  }

  return <>{children}</>;
}
