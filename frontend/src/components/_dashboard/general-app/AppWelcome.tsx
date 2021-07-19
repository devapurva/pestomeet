import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import googleClassroom from '@iconify/icons-mdi/google-classroom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Typography, Button, Card, CardContent, CardProps } from '@material-ui/core';
import UserCreateModal from 'pages/dashboard/UserCreateModal';
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
          If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
        </Typography>

        <div style={{ display: 'flex' }}>
          <UserCreateModal isEdit={false} currentUser={null} setRefresh={setRefresh} />

          <Button
            variant="contained"
            startIcon={<Icon icon={googleClassroom} />}
            style={{ marginLeft: 15 }}
          >
            New Batch
          </Button>
        </div>

        {/* <Button variant="contained" to="#" component={RouterLink}>
          Add Batch
        </Button> */}
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
