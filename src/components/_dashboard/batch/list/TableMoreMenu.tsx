import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// components
import BatchModal from '../../../../pages/dashboard/CreateBatchModal';
import { BatchManager, UserManager } from '../../../../@types/common';

// ----------------------------------------------------------------------

type TableMoreMenuProps = {
  onDelete: VoidFunction;
  userName: string;
  setRefresh?: any;
  currentBatch?: BatchManager;
  admins: UserManager[];
  otherUsers: UserManager[];
};

export default function TableMoreMenu({
  onDelete,
  userName,
  currentBatch,
  setRefresh,
  admins,
  otherUsers
}: TableMoreMenuProps) {
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
        id="simple-menu"
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
          <BatchModal
            isEdit={true}
            setRefresh={setRefresh}
            currentBatch={currentBatch}
            admins={admins}
            otherUsers={otherUsers}
          />
        </MenuItem>

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
