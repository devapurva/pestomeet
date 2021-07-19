import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
// components
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import { UserManager } from '../../@types/user';

// ----------------------------------------------------------------------

type UserCreateModalProps = {
  isEdit: boolean;
  currentUser?: UserManager | null;
  setRefresh: any;
  openModal?: boolean | undefined;
};

export default function UserCreateModal({
  isEdit,
  currentUser,
  setRefresh,
  openModal
}: UserCreateModalProps) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (openModal !== undefined) setOpen(openModal);
  }, [openModal]);

  return (
    <div>
      {!isEdit ? (
        <Button variant="contained" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
          New User
        </Button>
      ) : (
        <div style={{ display: 'flex' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </div>
      )}
      <Dialog
        open={open}
        maxWidth={isEdit ? 'lg' : 'md'}
        fullWidth
        onClose={(event, reason) => {
          console.log('pages', reason);
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
      >
        <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <UserNewForm
            isEdit={isEdit}
            currentUser={currentUser}
            setRefresh={setRefresh}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
