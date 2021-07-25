// material
import { Container, Grid } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppWidgets3
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  return (
    <Page title="Dashboard: Overview | PestoMeet">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user?.name} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgets1 />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgets2 />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgets3 />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
