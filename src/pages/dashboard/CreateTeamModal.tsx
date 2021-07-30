/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import accountChild from '@iconify/icons-mdi/account-child';
import accountMultiplePlus from '@iconify/icons-mdi/account-multiple-plus';
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
import TeamForm from '../../components/_dashboard/team/TeamForm';
import { TeamManager, UserManager } from '../../@types/user';

// ----------------------------------------------------------------------

type TeamModalProps = {
  isEdit: boolean;
  currentTeam?: TeamManager | null;
  setRefresh: any;
  type: string;
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

export default function TeamModal({ isEdit, currentTeam, setRefresh, type }: TeamModalProps) {
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

  return (
    <div>
      {!isEdit ? (
        <Button
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<Icon icon={type === 'mentor' ? accountChild : accountMultiplePlus} />}
        >
          Create {type === 'mentor' ? 'Mentor Team' : 'Buddy Pairings'}
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
          {isEdit ? 'Edit Team' : 'Create Team'}
        </DialogTitle>
        <DialogContent>
          <TeamForm
            type={type}
            isEdit={isEdit}
            currentTeam={currentTeam}
            setRefresh={setRefresh}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
