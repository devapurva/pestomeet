import { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Typography, Card, CardContent, CardProps } from '@material-ui/core';
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
}

export default function AppWelcome({ displayName }: AppWelcomeProps) {
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
    const otherList = userList?.filter((users) => users.role !== 'admin');
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
