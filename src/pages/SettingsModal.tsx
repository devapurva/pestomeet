/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
// hooks
// material
import { alpha, Stack, Tooltip } from '@material-ui/core';
import options2Fill from '@iconify/icons-eva/options-2-fill';
import settingsFill from '@iconify/icons-eva/settings-2-fill';
import Typography from '@material-ui/core/Typography';
// components
import { MIconButton } from '../components/@material-extend';
import MenuPopover from '../components/MenuPopover';
import SettingMode from '../components/settings/SettingMode';
import SettingColor from '../components/settings/SettingColor';
import SettingFullscreen from '../components/settings/SettingFullscreen';

// ----------------------------------------------------------------------

export default function SettingsModal() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Settings">
        <MIconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            padding: 0,
            width: 44,
            height: 44,
            color: (theme) => alpha(theme.palette.primary.dark, 1),
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                color: (theme) => alpha(theme.palette.primary.darker, 1),
                bgcolor: (theme) => alpha(theme.palette.grey[200], 0.72)
              }
            })
          }}
        >
          <Icon icon={options2Fill} />
        </MIconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Stack spacing={4} sx={{ pt: 3, px: 3, pb: 15 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Mode</Typography>
            <SettingMode />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Color</Typography>
            <SettingColor />
          </Stack>

          <SettingFullscreen />
        </Stack>
      </MenuPopover>
    </div>
  );
}
