/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { EventInput } from '@fullcalendar/common';
import { makeStyles } from '@material-ui/core/styles';
// material
import CloseIcon from '@material-ui/icons/Close';
import eyeFill from '@iconify/icons-eva/eye-fill';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Card,
  Grid,
  Stack,
  Typography,
  FormLabel,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  Button,
  Chip,
  Divider
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteAssignment, getAssignment } from '../../redux/slices/calendar';
// @types
import { AssignmentManager } from '../../@types/common';
// hooks
import useAuth from '../../hooks/useAuth';
import EmptyContent from '../../components/EmptyContent';

// ----------------------------------------------------------------------

type ViewResourceProps = {
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
  },
  legend: {
    paddingTop: 8
  },
  links: {
    marginBottom: 10
  },
  loader: {
    textAlign: 'center'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '33.33%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
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

export default function ViewAssignment({ eventId }: ViewResourceProps) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user } = useAuth();
  const { events } = useSelector((state: RootState) => state.calendar);
  const [eventDetails, setEventDetails] = useState<EventInput>({});
  const [currentAssignment, setCurrentAssignment] = useState<AssignmentManager>();
  const [assignmentList, setAssignmentList] = useState<AssignmentManager[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && eventId) {
      setLoading(true);
      dispatch(getAssignment(eventId))
        .then((response) => {
          if (response?.data?.result) {
            const resourceDetails = response?.data?.result?.[0];
            setCurrentAssignment(resourceDetails);
            setAssignmentList(response?.data?.result);
          } else if (!response) {
            handleClose();
            enqueueSnackbar('Error fetching assignment', { variant: 'error' });
          }
        })
        .catch((error) => {
          handleClose();
          enqueueSnackbar('Error fetching assignment', { variant: 'error' });
        });
      setLoading(false);
    }
  }, [open, eventId, dispatch]);

  useEffect(() => {
    if (open && events?.length > 0 && currentAssignment && Object.keys(eventDetails).length === 0) {
      setLoading(true);
      const details = events.find((event) => event.eventId === currentAssignment?.eventID);
      if (details) {
        setEventDetails(details);
      }
      setLoading(false);
    }
  }, [open, events, currentAssignment, eventDetails]);

  // eslint-disable-next-line consistent-return
  const parseLinks = (array: string[]) => {
    if (array?.length > 0) {
      return (
        <>
          {array?.length !== 0 && (
            <div>
              <Typography className={classes.heading}>Links:</Typography>
              {array?.map((link: string, index: number) => (
                <Typography key={`${link + index}`} className={classes.secondaryHeading}>
                  <a rel="noreferrer" href={link} target="_blank">
                    {link}
                  </a>
                </Typography>
              ))}
            </div>
          )}
        </>
      );
    }
  };

  const assignmentDelete = (id?: string) => {
    if (id) {
      setIsLoading(true);
      dispatch(deleteAssignment(id)).then((response) => {
        if (response?.data?.statusCode) {
          setAssignmentList((assignmentList) =>
            assignmentList.filter((list) => list.assignmentId !== id)
          );
          enqueueSnackbar('Assignment Deleted', { variant: 'success' });

          setTimeout(() => {
            if (assignmentList?.length === 0) {
              handleClose();
            }
          }, 200);
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <div>
      <div onClick={handleClickOpen} style={{ display: 'flex', justifyContent: 'start' }}>
        <Icon icon={eyeFill} width={24} height={24} /> View
      </div>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          View Assignment {eventDetails?.eventName ? `: ${eventDetails?.eventName}` : ''}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <div className={classes.loader}>
              <CircularProgress color="primary" />
            </div>
          ) : (
            <div>
              {assignmentList &&
                assignmentList.map((assignment, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header"
                    >
                      <div className={classes.column}>
                        <Typography className={classes.heading}>
                          {assignment.assignmentName}
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                      {parseLinks(assignment?.assignmentLinks)}
                    </AccordionDetails>
                    <Divider />
                    {(user?.id === assignment.uploaderId || user?.role === 'Super Admin') && (
                      <AccordionActions>
                        <Button
                          onClick={() => assignmentDelete(assignment.assignmentId)}
                          size="small"
                          color="error"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                      </AccordionActions>
                    )}
                  </Accordion>
                ))}
              {assignmentList?.length === 0 && <EmptyContent title="No Assignments Found Yet" />}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
