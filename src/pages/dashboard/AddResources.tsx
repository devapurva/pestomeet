import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
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
import ResourcesForm from '../../components/_dashboard/resources/ResourcesForm';
import { TeamManager, UserManager } from '../../@types/user';

// ----------------------------------------------------------------------

type TeamModalProps = {
  isEdit: boolean;
  currentTeam?: TeamManager | null;
  setRefresh: any;
  openModal?: boolean | undefined;
  mentors: UserManager[];
  students: UserManager[];
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

export default function TeamModal({
  isEdit,
  currentTeam,
  setRefresh,
  openModal,
  mentors,
  students
}: TeamModalProps) {
  const classes = useStyles();
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
          Add Resources
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
          {isEdit ? 'Edit Resources' : 'Add Resources'}
        </DialogTitle>
        <DialogContent>
          <ResourcesForm
            isEdit={isEdit}
            currentTeam={currentTeam}
            setRefresh={setRefresh}
            handleClose={handleClose}
            mentors={mentors}
            students={students}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
