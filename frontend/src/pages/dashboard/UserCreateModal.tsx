import { useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
// material
import { Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
// components
import UserNewForm from '../../components/_dashboard/user/UserNewForm';

// ----------------------------------------------------------------------

export default function UserCreateModal({ setRefresh }: { setRefresh: any }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state: RootState) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
        New User
      </Button>
      <Dialog open={open} maxWidth="lg" fullWidth onClose={handleClose}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <UserNewForm isEdit={false} setRefresh={setRefresh} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
