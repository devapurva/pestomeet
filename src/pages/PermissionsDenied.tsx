import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { PermissionDeniedIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function PermissionsDenied() {
  return (
    <RootStyle title="404 Page Not Found">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Permission Denied!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, you do not have permission to access this page. Please contact admin for
              further assistance.
            </Typography>

            <motion.div variants={varBounceIn}>
              <PermissionDeniedIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Go to Home
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
