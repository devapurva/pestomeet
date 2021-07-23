import { useState, useEffect } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import googleClassroom from '@iconify/icons-mdi/google-classroom';
// material
import {
  Button,
  Dialog,
  DialogContent,
  ListItemIcon,
  ListItemText,
  WithStyles
} from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
// components
import BatchForm from '../../components/_dashboard/user/BatchForm';
import { BatchManager, UserManager } from '../../@types/user';

// ----------------------------------------------------------------------

type BatchModalProps = {
  isEdit: boolean;
  currentBatch?: BatchManager | null;
  setRefresh: any;
  openModal?: boolean | undefined;
  admins: UserManager[];
  otherUsers: UserManager[];
};

const styles = (theme: Theme) =>
  createStyles({
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
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode | string;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
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
});

export default function BatchModal({
  isEdit,
  currentBatch,
  setRefresh,
  openModal,
  admins,
  otherUsers
}: BatchModalProps) {
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
        <Button
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<Icon icon={googleClassroom} />}
        >
          Create Batch
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
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {isEdit ? 'Edit Batch' : 'Create Batch'}
        </DialogTitle>
        <DialogContent>
          <BatchForm
            isEdit={isEdit}
            currentBatch={currentBatch}
            setRefresh={setRefresh}
            handleClose={handleClose}
            admins={admins}
            otherUsers={otherUsers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}