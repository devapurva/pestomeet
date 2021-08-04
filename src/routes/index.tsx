import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: any) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        }
      ]
    },

    // Dashboard Routes
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/overview" replace /> },
        { path: '/dashboard', element: <Navigate to="/dashboard/overview" replace /> },
        { path: '/dashboard/overview', element: <GeneralApp /> },
        {
          path: '/dashboard/all-user',
          children: [
            {
              path: '/',
              element: (
                <RoleBasedGuard accessibleRoles={['Super Admin']}>
                  <AllUserList />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: '/dashboard/mentor',
          children: [
            {
              path: '/',
              element: (
                <RoleBasedGuard accessibleRoles={['Admin', 'Super Admin']}>
                  <MentorList />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: '/dashboard/student',
          children: [
            {
              path: '/',
              element: (
                <RoleBasedGuard accessibleRoles={['Admin', 'Super Admin', 'Mentor']}>
                  <StudentList />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: '/dashboard/batch',
          children: [
            {
              path: '/',
              element: (
                <RoleBasedGuard accessibleRoles={['Admin', 'Super Admin']}>
                  <Batches />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: '/dashboard/team-mentor',
          children: [
            {
              path: '/',
              element: (
                <RoleBasedGuard accessibleRoles={['Admin', 'Super Admin', 'Mentor']}>
                  <MentorTeams />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: '/dashboard/buddy-pairing',
          children: [
            {
              path: '/',
              element: (
                <RoleBasedGuard accessibleRoles={['Admin', 'Super Admin', 'Mentor']}>
                  <BuddyPairing />
                </RoleBasedGuard>
              )
            }
          ]
        },
        { path: '/dashboard/calendar', element: <Calendar /> },
        { path: '/dashboard/resources', element: <Resources /> },
        { path: '/dashboard/assignments', element: <Assignments /> },
        { path: '/dashboard/my-profile', element: <MyProfile /> }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const AllUserList = Loadable(lazy(() => import('../pages/dashboard/AllUserList')));
const StudentList = Loadable(lazy(() => import('../pages/dashboard/StudentList')));
const MentorList = Loadable(lazy(() => import('../pages/dashboard/MentorList')));
const Batches = Loadable(lazy(() => import('../pages/dashboard/Batches')));
const MentorTeams = Loadable(lazy(() => import('../pages/dashboard/MentorTeam')));
const BuddyPairing = Loadable(lazy(() => import('../pages/dashboard/BuddyPairing')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Resources = Loadable(lazy(() => import('../pages/dashboard/Resources')));
const Assignments = Loadable(lazy(() => import('../pages/dashboard/Assignments')));
const MyProfile = Loadable(lazy(() => import('../pages/dashboard/MyProfile')));
// Main
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
