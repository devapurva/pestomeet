import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// components
import ViewResource from '../../../../pages/dashboard/ViewResources';
import { BatchManager, UserManager } from '../../../../@types/common';

// ----------------------------------------------------------------------

type UserMoreMenuProps = {
  setRefresh?: any;
  eventId?: string;
};

export default function UserMoreMenu({ setRefresh, eventId }: UserMoreMenuProps) {
  const ref = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton ref={ref} onClick={handleClick}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        id="resource-list-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          {Boolean(anchorEl) && <ViewResource eventId={eventId} />}
        </MenuItem>
      </Menu>
    </>
  );
}
