// material
import { Container } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  return (
    <Page title="User: Create a new user">
      <Container>
        <HeaderBreadcrumbs
          heading="Create a new user"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.mentor },
            { name: 'New user' }
          ]}
        />

        <UserNewForm isEdit={false} />
      </Container>
    </Page>
  );
}
