import { useEffect } from 'react';
// material
import { Container, Grid } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getHomeMetrics } from '../../redux/slices/lists';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppWidgets3,
  AppWidgets4
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const dispatch = useDispatch();
  const { metrics } = useSelector((state: RootState) => state.list);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getHomeMetrics(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Page title="Dashboard: Overview | PestoMeet">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user?.name} userRole={user?.role} />
          </Grid>

          {user?.role !== 'Student' && (
            <Grid item xs={12} md={3}>
              <AppWidgets1 studentCount={metrics?.studentCount} />
            </Grid>
          )}

          {user?.role !== 'Student' && user?.role !== 'Mentor' && (
            <Grid item xs={12} md={3}>
              <AppWidgets2 mentorCount={metrics?.mentorCount} />
            </Grid>
          )}

          {user?.role !== 'Student' && user?.role !== 'Mentor' && (
            <Grid item xs={12} md={3}>
              <AppWidgets3 batchCount={metrics?.batchCount} />
            </Grid>
          )}

          {user?.role !== 'Student' && user?.role !== 'Mentor' && (
            <Grid item xs={12} md={3}>
              <AppWidgets4 teamCount={metrics?.teamCount} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
