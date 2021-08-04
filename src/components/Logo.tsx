/* eslint-disable jsx-a11y/alt-text */
// material
import { Box, BoxProps } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Logo({ sx }: BoxProps) {
  return (
    <Box sx={{ width: 100, height: 100, ...sx }}>
      <img src="/static/pesto-logo-green.png" />
    </Box>
  );
}
