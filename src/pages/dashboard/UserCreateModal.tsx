/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
// material
import { Button, Dialog, DialogContent, ListItemIcon, ListItemText } from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
// components
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import { UserManager } from '../../@types/user';

// ----------------------------------------------------------------------

type UserCreateModalProps = {
  isEdit: boolean;
  currentUser?: UserManager | null;
  setRefresh: any;
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode | string;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default function UserCreateModal({ isEdit, currentUser, setRefresh }: UserCreateModalProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {!isEdit ? (
        <Button variant="contained" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
          New User
        </Button>
      ) : (
        <div onClick={handleClickOpen} style={{ display: 'flex' }}>
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
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {isEdit ? 'Edit User' : 'Create New User'}
        </DialogTitle>
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
