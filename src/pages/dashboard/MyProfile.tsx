// material
import { Container } from '@material-ui/core';
// redux
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function MyProfile() {
  const { user } = useAuth();
  return (
    <Page title="Teams: List">
      <Container>
        <HeaderBreadcrumbs
          heading="My Profile"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'My Profile' }]}
        />
        <UserNewForm isEdit={true} currentUser={user?.user} />
      </Container>
    </Page>
  );
}
