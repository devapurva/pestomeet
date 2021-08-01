import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import checkAll from '@iconify/icons-mdi/check-all';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// components
import UserCreateModal from '../../../../pages/dashboard/UserCreateModal';
import { UserManager } from '../../../../@types/common';

// ----------------------------------------------------------------------

type UserMoreMenuProps = {
  onDelete: VoidFunction;
  userName: string;
  setRefresh?: any;
  currentUser?: UserManager;
  onApprove: VoidFunction;
};

export default function UserMoreMenu({
  onDelete,
  onApprove,
  userName,
  currentUser,
  setRefresh
}: UserMoreMenuProps) {
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
        id="user-list-menu"
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
          <UserCreateModal isEdit={true} setRefresh={setRefresh} currentUser={currentUser} />
        </MenuItem>

        {currentUser?.approval === 'inprogress' && (
          <MenuItem onClick={onApprove} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={checkAll} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Approve" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        <MenuItem onClick={onDelete} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
