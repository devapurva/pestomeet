/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
// material
import { Button, Dialog, DialogContent, ListItemIcon, ListItemText } from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
// components
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ResourcesForm from '../../components/_dashboard/resources/ResourcesForm';
import { ResourceManager } from '../../@types/common';

// ----------------------------------------------------------------------

type ResourceModalProps = {
  isEdit: boolean;
  setRefresh: any;
  eventId?: string;
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

export default function ResourceModal({ isEdit, setRefresh, eventId }: ResourceModalProps) {
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
          id="add-resource"
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<Icon icon={plusFill} />}
        >
          Add Resources
        </Button>
      ) : (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
          {isEdit ? 'View Resources' : 'Add Resources'}
        </DialogTitle>
        <DialogContent>
          <ResourcesForm
            isEdit={isEdit}
            setRefresh={setRefresh}
            handleClose={handleClose}
            eventId={eventId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
