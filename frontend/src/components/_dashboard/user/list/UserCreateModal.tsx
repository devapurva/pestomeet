import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
// redux
import { useDispatch, useSelector, RootState } from '../../../../redux/store';
// import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Page from '../../..//Page';
import HeaderBreadcrumbs from '../../..//HeaderBreadcrumbs';
import UserNewForm from '../UserNewForm';

// ----------------------------------------------------------------------

export default function UserCreateModal() {
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

  // useEffect(() => {
  //   dispatch(getUserList());
  // }, [dispatch]);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
        New User
      </Button>
      <Dialog open={open} maxWidth="lg" onClose={handleClose}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <UserNewForm isEdit={isEdit} />
        </DialogContent>
        {/* <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleClose} variant="contained">
          Subscribe
        </Button>
      </DialogActions> */}
      </Dialog>
    </div>
  );
}
