import { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Typography, Card, CardContent, CardProps, Button } from '@material-ui/core';
import { Icon } from '@iconify/react';
import newspaperVariantPlus from '@iconify/icons-mdi/newspaper-plus';
import calenderAdd from '@iconify/icons-mdi/calendar-add';
// components
import UserCreateModal from 'pages/dashboard/UserCreateModal';
import BatchModal from 'pages/dashboard//CreateBatchModal';
// types
import { UserManager } from '../../../@types/common';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { getAllUserList } from '../../../redux/slices/lists';
// material
import { SeoIllustration } from '../../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  [theme.breakpoints.up('xl')]: { height: 320 }
}));

// ----------------------------------------------------------------------

interface AppWelcomeProps extends CardProps {
  displayName?: string;
  userRole?: string;
}

export default function AppWelcome({ displayName, userRole }: AppWelcomeProps) {
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { userList } = useSelector((state: RootState) => state.list);
  const [admins, setAdmins] = useState<UserManager[]>([]);
  const [otherUsers, setOtherUsers] = useState<UserManager[]>([]);

  useEffect(() => {
    dispatch(getAllUserList());
  }, [dispatch]);

  useEffect(() => {
    const adminList = userList?.filter((users) => users.role === 'admin');
    const otherList = userList?.filter(
      (users) => users.role !== 'admin' && users.role !== 'super admin'
    );
    setAdmins(adminList);
    setOtherUsers(otherList);
  }, [userList]);

  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800'
        }}
      >
        <Typography gutterBottom variant="h4">
          Welcome back,
          <br /> {!displayName ? '...' : displayName}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          Here are few actions and metrics to get you started!
        </Typography>

        {(userRole === 'Admin' || userRole === 'Super Admin') && (
          <div style={{ display: 'flex' }}>
            <UserCreateModal isEdit={false} currentUser={null} setRefresh={setRefresh} />

            <div style={{ marginLeft: 15 }}>
              <BatchModal
                isEdit={false}
                currentBatch={null}
                setRefresh={setRefresh}
                admins={admins}
                otherUsers={otherUsers}
              />
            </div>
          </div>
        )}

        {userRole === 'Mentor' && (
          <div style={{ display: 'flex' }}>
            <Button
              variant="contained"
              onClick={() => window.open('/dashboard/assignments', '_self')}
              startIcon={<Icon icon={newspaperVariantPlus} />}
            >
              View Assignments
            </Button>

            <div style={{ marginLeft: 15 }}>
              <Button
                variant="contained"
                onClick={() => window.open('/dashboard/calendar', '_self')}
                startIcon={<Icon icon={newspaperVariantPlus} />}
              >
                View Events
              </Button>
            </div>
          </div>
        )}

        {userRole === 'Student' && (
          <div style={{ display: 'flex' }}>
            <Button
              variant="contained"
              onClick={() => window.open('/dashboard/resources', '_self')}
              startIcon={<Icon icon={newspaperVariantPlus} />}
            >
              View Resources
            </Button>

            <div style={{ marginLeft: 15, marginRight: 15 }}>
              <Button
                variant="contained"
                onClick={() => window.open('/dashboard/calendar', '_self')}
                startIcon={<Icon icon={calenderAdd} />}
              >
                Book Session
              </Button>
            </div>

            <Button
              variant="contained"
              onClick={() => window.open('/dashboard/assignments', '_self')}
              startIcon={<Icon icon={newspaperVariantPlus} />}
            >
              View Assignments
            </Button>
          </div>
        )}
      </CardContent>

      <SeoIllustration
        sx={{
          p: 2,
          height: 280,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
    </RootStyle>
  );
}
