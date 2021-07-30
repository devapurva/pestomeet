import { Icon } from '@iconify/react';
import accountGroup from '@iconify/icons-mdi/account-group';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Typography, Box, CardProps } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.info.light
}));

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 120,
  height: 120,
  opacity: 0.12,
  position: 'absolute',
  right: theme.spacing(-3),
  color: theme.palette.common.black
}));

// ----------------------------------------------------------------------
interface AppWidgets1Props extends CardProps {
  studentCount: number;
}

export default function AppWidgets1({ studentCount }: AppWidgets1Props) {
  return (
    <RootStyle>
      <Box sx={{ ml: 3, color: 'grey.800' }}>
        <Typography variant="h4"> {fNumber(studentCount)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          Total Students
        </Typography>
      </Box>
      <IconStyle icon={accountGroup} />
    </RootStyle>
  );
}
