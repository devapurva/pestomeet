/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import accountChild from '@iconify/icons-mdi/account-child';
import accountMultiplePlus from '@iconify/icons-mdi/account-multiple-plus';
// material
import { Button, Dialog, DialogContent, ListItemIcon, ListItemText } from '@material-ui/core';
import editFill from '@iconify/icons-eva/edit-fill';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
// components
import TeamForm from '../../components/_dashboard/team/TeamForm';
import { TeamManager } from '../../@types/common';

// ----------------------------------------------------------------------

type TeamModalProps = {
  isEdit: boolean;
  currentTeam?: TeamManager | null;
  setRefresh: any;
  type: string;
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

export default function TeamModal({ isEdit, currentTeam, setRefresh, type }: TeamModalProps) {
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
          id="create-team"
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
